import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { getUserDetail, adjustCredits, getCreditHistory, UserDetail, CreditTransaction } from '../../services/adminApi';
import { useToast } from '../../hooks/use-toast';

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Credit adjustment form
  const [adjusting, setAdjusting] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<'Refund' | 'Promo' | 'Support' | 'Correction' | 'Violation'>('Support');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const [userData, historyData] = await Promise.all([
        getUserDetail(userId),
        getCreditHistory(userId)
      ]);
      setUser(userData);
      setCreditHistory(historyData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustCredits = async () => {
    if (!userId || !amount) return;
    
    setAdjusting(true);
    try {
      await adjustCredits(userId, {
        amount: parseInt(amount),
        reason,
        notes: notes || undefined
      });
      
      toast({
        title: "Credits Adjusted",
        description: `Successfully ${parseInt(amount) > 0 ? 'added' : 'deducted'} ${Math.abs(parseInt(amount))} credits`
      });
      
      // Reset form and refresh data
      setAmount('');
      setNotes('');
      fetchUserData();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to adjust credits",
        variant: "destructive"
      });
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">User not found</p>
              <Button onClick={() => navigate('/admin/users')} className="mt-4">
                Back to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalCredits = user.monthly_credits_remaining + user.daily_credits_remaining + user.topup_credits;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => navigate('/admin/users')} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold mb-2">User Details</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="font-medium">{user.name || 'Not set'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <p className="font-medium">{user.phone_number || 'Not set'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Created:</span>
                <p className="font-medium">{new Date(user.created_at).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Subscription:</span>
                <Badge>{user.subscription_type}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Credits Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Total Credits:</span>
                <p className="text-2xl font-bold">{totalCredits}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Monthly:</span>
                  <p className="font-semibold">{user.monthly_credits_remaining}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Daily:</span>
                  <p className="font-semibold">{user.daily_credits_remaining}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Top-up:</span>
                  <p className="font-semibold">{user.topup_credits}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Next reset: {user.next_credit_reset ? new Date(user.next_credit_reset).toLocaleString() : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Adjustment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adjust Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (positive to add, negative to deduct)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 10 or -5"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Select value={reason} onValueChange={(value: any) => setReason(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Refund">Refund</SelectItem>
                      <SelectItem value="Promo">Promo</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Correction">Correction</SelectItem>
                      <SelectItem value="Violation">Violation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  className="h-32"
                />
              </div>
            </div>
            <Button
              onClick={handleAdjustCredits}
              disabled={!amount || adjusting}
              className="mt-4"
            >
              {adjusting ? 'Adjusting...' : 'Apply Credit Adjustment'}
            </Button>
          </CardContent>
        </Card>

        {/* Credit History */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {creditHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No credit transactions yet</p>
            ) : (
              <div className="space-y-3">
                {creditHistory.map((tx) => (
                  <Card key={tx.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block text-xs">Date</span>
                          <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Amount</span>
                          <div className="flex items-center gap-1">
                            {tx.amount > 0 ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span className="text-green-600 font-semibold">+{tx.amount}</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3 text-red-600" />
                                <span className="text-red-600 font-semibold">{tx.amount}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Reason</span>
                          <Badge variant="outline" className="text-xs">{tx.reason}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Balance</span>
                          <span>{tx.balance_before} → {tx.balance_after}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Notes</span>
                          <span className="text-muted-foreground">{tx.notes || '-'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetail;

