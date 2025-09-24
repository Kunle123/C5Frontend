import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  User, 
  Shield, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getUser, updateUser, getUserIdFromToken, getSubscription, getPaymentMethods, getPaymentHistory, cancelSubscription } from "../api";

function ProfileSettings() {
  const [profile, setProfile] = useState({ name: "", email: "", phone_number: "", emailVerified: false });
  const [subscription, setSubscription] = useState({ plan: "NONE", status: "INACTIVE", renewal: "N/A" });
  const [billing, setBilling] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const user = await getUser(token);
        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone_number: user.phone_number || '',
          emailVerified: !!user.email_verified
        });
        if (userId) {
          const [sub, billingData, methods] = await Promise.all([
            getSubscription(userId, token),
            getPaymentHistory ? getPaymentHistory(userId, token) : Promise.resolve([]),
            getPaymentMethods ? getPaymentMethods(userId, token) : Promise.resolve([]),
          ]);
          setSubscription({
            plan: sub?.subscription_type
              ? (sub.subscription_type.toLowerCase() === 'monthly' ? 'Monthly' : sub.subscription_type.toLowerCase() === 'annual' ? 'Annual' : 'Free')
              : (sub?.plan_name || 'NONE'),
            status: sub?.status || 'INACTIVE',
            renewal: sub?.renewal_date || 'N/A',
          });
          setBilling(billingData || []);
          setPaymentMethods(methods || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load account info');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, userId]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      console.log('Updating profile with:', profile); // Debug log
      const updated = await updateUser(profile, token);
      setProfile({
        name: updated.name || profile.name || '',
        email: updated.email || profile.email || '',
        phone_number: updated.phone_number !== undefined ? updated.phone_number : profile.phone_number,
        emailVerified: !!(updated.email_verified !== undefined ? updated.email_verified : profile.emailVerified)
      });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    const subId = (subscription && typeof subscription === 'object' && 'id' in subscription) ? (subscription as any).id : null;
    if (!subId || typeof subId !== 'string') return;
    setCancelling(true);
    setError("");
    try {
      await cancelSubscription(subId, token);
      setSubscription({ ...subscription, status: 'Canceled' });
    } catch (err: any) {
      setError(err.message || 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-card-foreground">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and subscription preferences</p>
        </div>
        {/* Profile Section */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleUpdateProfile(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={profile.phone_number}
                    onChange={e => setProfile({ ...profile, phone_number: e.target.value })}
                    placeholder="+44 7123 456 789" // UK example
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">Phone must be in international format, e.g. +44 7123 456 789</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="h-10"
                    disabled
                  />
                  <div className="flex items-center gap-2">
                    {profile.emailVerified ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-3">
                <Button className="gap-2" type="submit" disabled={saving}>
                  <User className="h-4 w-4" />
                  Update Profile
                </Button>
                <Button variant="outline" className="gap-2" type="button" disabled>
                  <Shield className="h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="destructive" className="gap-2" type="button" disabled>
                  <AlertTriangle className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
              {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </form>
          </CardContent>
        </Card>
        {/* Subscription Section */}
        <Card className="shadow-card">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Subscription & Billing</CardTitle>
                <CardDescription>Manage your subscription plan and billing information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Current Plan */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Plan</h3>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="inactive" className="text-sm">
                      {subscription.plan}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {subscription.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Renewal: {subscription.renewal}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled>Upgrade</Button>
                  <Button variant="outline" size="sm" disabled>Downgrade</Button>
                </div>
              </div>
              <Button variant="link" className="text-destructive p-0 h-auto" onClick={handleCancelSubscription} disabled={cancelling || subscription.status !== 'Active' || !('id' in subscription && (subscription as any).id)}>
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            </div>
            <Separator />
            {/* Billing History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing History</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Amount</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billing.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No billing history available
                        </TableCell>
                      </TableRow>
                    ) : (
                      billing.map((bill, idx) => (
                        <TableRow key={bill.id || idx}>
                          <TableCell>{bill.date || bill.created_at}</TableCell>
                          <TableCell>{bill.amount}</TableCell>
                          <TableCell>{bill.status}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Separator />
            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                <div className="text-center space-y-3">
                  <CreditCard className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">No payment methods on file</p>
                  <Button className="gap-2" disabled>
                    <CreditCard className="h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfileSettings;