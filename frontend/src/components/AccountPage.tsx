import React, { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useToast } from "../hooks/use-toast";
import { Loader2, Camera, Mail, Phone, User, CreditCard, Download, Shield, Trash2, Coins, Calendar, Clock } from "lucide-react";
import { getUserIdFromToken, getSubscription, getPaymentMethods } from '../api';

const API_BASE = "https://api-gw-production.up.railway.app";

export function AccountPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    linkedin: "",
    address_line1: "",
    city_state_postal: "",
    emailVerified: false,
    avatarUrl: "",
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Subscription state (static for now)
  const [subscription, setSubscription] = useState({
    plan: '',
    status: '',
    nextBilling: '',
    amount: '',
  });
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState('');

  // Credits state
  const [credits, setCredits] = useState<any>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState<string | null>(null);

  // Fetch both credits and subscription in sync
  const fetchAccountData = async () => {
    setCreditsLoading(true);
    setSubscriptionLoading(true);
    setCreditsError(null);
    setSubscriptionError('');
    try {
      const token = localStorage.getItem('token') || '';
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error('Not authenticated');
      // Fetch credits
      const creditsRes = await fetch('https://api-gw-production.up.railway.app/api/user/credits', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!creditsRes.ok) throw new Error('Failed to fetch credits');
      const creditsData = await creditsRes.json();
      setCredits(creditsData);
      // Fetch subscription
      const sub = await getSubscription(userId, token);
      const plan = sub?.plan_name && sub.plan_name !== 'N/A' ? sub.plan_name : 'Free';
      const status = sub?.status && sub.status !== 'N/A' ? sub.status : 'Active';
      setSubscription({
        plan,
        status,
        nextBilling: sub?.renewal_date || 'N/A',
        amount: sub?.amount ? `£${sub.amount}/month` : '£0',
      });
    } catch (err: any) {
      setCreditsError(err.message || 'Failed to load credits');
      setSubscriptionError(err.message || 'Failed to load subscription');
    } finally {
      setCreditsLoading(false);
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState('');

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setPaymentMethodsLoading(true);
      setPaymentMethodsError('');
      try {
        const token = localStorage.getItem('token') || '';
        const userId = getUserIdFromToken(token);
        if (!userId) throw new Error('Not authenticated');
        const methods = await getPaymentMethods(userId, token);
        setPaymentMethods(Array.isArray(methods) ? methods : []);
      } catch (err) {
        setPaymentMethodsError((err && (err as any).message) || 'Failed to load payment methods');
      } finally {
        setPaymentMethodsLoading(false);
      }
    };
    fetchPaymentMethods();
  }, []);

  const [planIdMap, setPlanIdMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/subscriptions/plans");
        if (!res.ok) throw new Error("Failed to fetch plans");
        const plans = await res.json();
        const map: { [key: string]: string } = {};
        plans.forEach((plan: any) => {
          if (plan.name && plan.id) map[plan.name] = plan.id;
        });
        setPlanIdMap(map);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchPlans();
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      setError("");
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          linkedin: data.linkedin || "",
          address_line1: data.address_line1 || "",
          city_state_postal: data.city_state_postal || "",
          emailVerified: !!data.email_verified,
          avatarUrl: "",
        });
        setEditedProfile({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          linkedin: data.linkedin || "",
          address_line1: data.address_line1 || "",
          city_state_postal: data.city_state_postal || "",
          emailVerified: !!data.email_verified,
          avatarUrl: "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setError("");
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (editedProfile.phone_number && !phoneRegex.test(editedProfile.phone_number)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter phone number in international format (e.g., +447966461005)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedProfile.name,
          phone_number: editedProfile.phone_number,
          linkedin: editedProfile.linkedin,
          address_line1: editedProfile.address_line1,
          city_state_postal: editedProfile.city_state_postal,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile({
        ...profile,
        name: data.name || editedProfile.name,
        phone_number: data.phone_number || editedProfile.phone_number,
        linkedin: data.linkedin || editedProfile.linkedin,
        address_line1: data.address_line1 || editedProfile.address_line1,
        city_state_postal: data.city_state_postal || editedProfile.city_state_postal,
      });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      toast({
        title: "Update failed",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Verification email sent",
      description: "Please check your inbox for the verification link.",
    });
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.new.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsPasswordModalOpen(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    toast({
      title: "Password changed",
      description: "Your password has been successfully updated.",
    });
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
    });
    // In a real app, this would redirect to login or logout
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditedProfile({ ...editedProfile, avatarUrl: url });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    }
  };

  const handleUpgradePlan = async (plan: string) => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      const email = localStorage.getItem("user_email") || localStorage.getItem("email") || profile.email || "";
      // Only use UUID for user_id, never email
      const user_id = localStorage.getItem("user_id") || localStorage.getItem("userId") || localStorage.getItem("id");
      if (!token || !email || !user_id) {
        toast({
          title: "Missing user ID",
          description: "Could not find your user ID. Please log in again or contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const return_url = window.location.origin + "/payment-success";
      let res;
      if (plan === 'Monthly' || plan === 'Annual') {
        const PLAN_NAME_MAP = {
          Monthly: "Monthly Subscription",
          Annual: "Annual Subscription"
        };
        const plan_id = planIdMap[PLAN_NAME_MAP[plan] || plan];
        if (!plan_id) throw new Error("Plan ID not found for selected plan");
        res = await fetch(`/api/subscriptions/checkout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_id, email, user_id, return_url }),
        });
      } else if (plan === 'Top-up') {
        res = await fetch(`/api/payments/topup`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id, email, return_url }),
        });
      }
      if (!res || !res.ok) throw new Error("Failed to initiate payment");
      const { checkout_url } = await res.json();
      // After payment, refresh credits/subscription
      await fetchAccountData();
      window.location.href = checkout_url;
    } catch (err: any) {
      setError(err.message || "Failed to start payment");
      toast({
        title: "Payment Error",
        description: err.message || "Failed to start payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Stripe Customer Portal
  const handleManagePaymentMethods = async () => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to manage payment methods.",
        variant: "destructive",
      });
      return;
    }
    const res = await fetch("/api/payments/customer-portal", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      toast({
        title: "Access denied",
        description: "Could not open Stripe Customer Portal. Please log in again or contact support.",
        variant: "destructive",
      });
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  };

  // Handler for Download Invoice
  const handleDownloadInvoice = () => {
    toast({
      title: "Download initiated",
      description: "Your invoice is being downloaded.",
    });
    // In a real app, this would trigger a backend API call to generate and serve the invoice
  };

  // Handler for Cancel Subscription
  const handleCancelSubscription = () => {
    toast({
      title: "Subscription cancelled",
      description: "Your subscription has been cancelled. You will lose access to premium features.",
      variant: "destructive",
    });
    // In a real app, this would trigger a backend API call to cancel the subscription
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and subscription preferences</p>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={editedProfile.avatarUrl} />
                  <AvatarFallback className="text-lg">
                    {editedProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      value={editedProfile.email}
                      disabled
                      className="flex-1"
                    />
                    {profile.emailVerified ? (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Verified
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+44 7xxxx xxx xxx"
                    value={editedProfile.phone_number}
                    onChange={e => setEditedProfile({ ...editedProfile, phone_number: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={editedProfile.linkedin}
                    onChange={(e) => setEditedProfile({ ...editedProfile, linkedin: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/your-profile"
                    type="url"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input
                    id="address_line1"
                    value={editedProfile.address_line1}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address_line1: e.target.value })}
                    disabled={!isEditing}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city_state_postal">City, State, Postal</Label>
                  <Input
                    id="city_state_postal"
                    value={editedProfile.city_state_postal}
                    onChange={(e) => setEditedProfile({ ...editedProfile, city_state_postal: e.target.value })}
                    disabled={!isEditing}
                    placeholder="London, UK, SW1A 1AA"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={isLoading} className="flex-1">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleEditProfile} variant="outline">
                    Edit Profile
                  </Button>
                )}
                <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordData.current}
                          onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.new}
                          onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsPasswordModalOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordChange} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Change Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          {/* Subscription & Billing Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscriptionLoading ? (
                <span>Loading subscription...</span>
              ) : subscriptionError ? (
                <span className="text-red-500">{subscriptionError}</span>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Plan</span>
                    <Badge variant="default">{subscription.plan}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      {subscription.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Billing</span>
                    <span className="text-sm font-medium">{subscription.nextBilling}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-sm font-medium">{subscription.amount}</span>
                  </div>
                </div>
              )}
              {/* Credit Balance Section (moved here) */}
              <div className="mt-6">
                {creditsLoading ? (
                  <span>Loading credits...</span>
                ) : creditsError ? (
                  <span className="text-red-500">{creditsError}</span>
                ) : credits ? (
                  <>
                    <div className="grid gap-3 md:grid-cols-3">
                      {/* Daily Credits */}
                      <div className="flex flex-col justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-warning" />
                          <span className="text-sm font-medium">Daily Credits</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {credits.daily_credits_remaining ?? 0}
                          <span className="text-sm font-normal text-muted-foreground">{
                            credits.subscription_type?.toLowerCase() === 'annual' ? '/5' : credits.subscription_type?.toLowerCase() === 'monthly' ? '/3' : '/0'
                          }</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Expires end of day</p>
                      </div>
                      {/* Monthly Credits */}
                      <div className="flex flex-col justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Monthly Credits</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {credits.monthly_credits_remaining ?? 0}
                          <span className="text-sm font-normal text-muted-foreground">{
                            credits.subscription_type?.toLowerCase() === 'free' ? '/3' : '/50'
                          }</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Renews monthly</p>
                      </div>
                      {/* Top-up Credits */}
                      <div className="flex flex-col justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Coins className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium">Top-up Credits</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          {credits.topup_credits_remaining ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Expires after 1 month</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t mt-4">
                      <span className="text-sm font-medium">Total Available:</span>
                      <span className="text-lg font-bold text-primary">
                        {(credits.daily_credits_remaining ?? 0) + (credits.monthly_credits_remaining ?? 0) + (credits.topup_credits_remaining ?? 0)} credits
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              {/* Plan Tiles Section */}
              <div className="space-y-6 mt-6">
                {/* Monthly Plan Tile */}
                <div className="border rounded-xl p-6 bg-white/90 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold text-lg">Monthly</div>
                      <div className="text-blue-700 font-bold text-xl">£24.99<span className="text-base font-normal">/month</span></div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Popular</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">100 credits monthly, 3 daily, priority support</div>
                  <Button variant="default" size="lg" className="w-full" onClick={() => handleUpgradePlan('Monthly')} disabled={isLoading}>
                    Upgrade to Monthly
                  </Button>
                </div>
                {/* Annual Plan Tile */}
                <div className="border rounded-xl p-6 bg-white/90 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold text-lg">Annual</div>
                      <div className="text-blue-700 font-bold text-xl">£199<span className="text-base font-normal">/year</span></div>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">Save 33%</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">100 credits monthly, 5 daily, priority support</div>
                  <Button variant="default" size="lg" className="w-full" onClick={() => handleUpgradePlan('Annual')} disabled={isLoading}>
                    Upgrade to Annual
                  </Button>
                </div>
                {/* Top-up Plan Tile */}
                <div className="border rounded-xl p-6 bg-white/90 shadow-sm">
                  <div className="font-semibold text-lg mb-1">Top-up</div>
                  <div className="text-blue-700 font-bold text-xl">£29.99<span className="text-base font-normal"> one-off</span></div>
                  <div className="text-sm text-muted-foreground mb-4">100 credits, no subscription, expires in 1 month</div>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => handleUpgradePlan('Top-up')} disabled={isLoading}>
                    Buy Credits
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handleManagePaymentMethods} disabled={isLoading}>
                  Manage Payment Methods
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleDownloadInvoice} disabled={isLoading}>
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleCancelSubscription} disabled={isLoading}>
                  Cancel Subscription
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Billing History</h4>
                <div className="text-sm text-muted-foreground">
                  No billing history available
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Privacy & Data</h4>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download My Data
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Payment Methods Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentMethodsLoading ? (
                <span>Loading payment methods...</span>
              ) : paymentMethodsError ? (
                <span className="text-red-500">{paymentMethodsError}</span>
              ) : paymentMethods.length === 0 ? (
                <span className="text-muted-foreground">No payment methods on file.</span>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((pm, idx) => (
                    <div key={pm.id || idx} className="flex justify-between items-center border rounded-lg p-3 bg-muted/50">
                      <div>
                        <div className="font-medium">{pm.brand ? pm.brand.toUpperCase() : 'Card'}</div>
                        <div className="text-sm text-muted-foreground">**** **** **** {pm.last4}</div>
                        <div className="text-xs text-muted-foreground">Exp: {pm.exp_month}/{pm.exp_year}</div>
                      </div>
                      {pm.is_default && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
