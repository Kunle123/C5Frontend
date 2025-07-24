import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CreditCard, 
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  XCircle
} from "lucide-react";

function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "kunle2000@gmail.com",
    phone: "",
    emailVerified: false
  });

  const [subscription, setSubscription] = useState({
    plan: "NONE",
    status: "INACTIVE",
    renewal: "N/A"
  });

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
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">Phone must be in international format</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
                {!profile.emailVerified && (
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    Resend Verification Email
                  </Button>
                )}
              </div>

              <Separator />

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2">
                  <User className="h-4 w-4" />
                  Update Profile
                </Button>
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="destructive" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
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
                  <Button size="sm">Upgrade</Button>
                  <Button variant="outline" size="sm">Downgrade</Button>
                </div>
              </div>
              <Button variant="link" className="text-destructive p-0 h-auto">
                Cancel Subscription
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
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No billing history available
                      </TableCell>
                    </TableRow>
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
                  <Button className="gap-2">
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