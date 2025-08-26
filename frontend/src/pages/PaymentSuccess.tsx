import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'canceled' | 'unknown'>('unknown');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('canceled') === 'true') {
      setStatus('canceled');
    } else if (params.get('success') === 'true' || params.get('session_id')) {
      setStatus('success');
    } else {
      setStatus('success'); // fallback for legacy/old links
    }
  }, [location.search]);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleRetry = () => {
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <CheckCircle className={`w-8 h-8 ${status === 'success' ? 'text-success' : 'text-destructive'}`} />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {status === 'success' ? 'Payment Successful!' : status === 'canceled' ? 'Payment Canceled' : 'Processing...'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {status === 'success' && (
                <>
                  <p className="text-muted-foreground">
                    Thank you for your payment! Your transaction has been completed successfully.
                  </p>
                  <Button 
                    onClick={handleGoToDashboard}
                    className="w-full"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                </>
              )}
              {status === 'canceled' && (
                <>
                  <p className="text-muted-foreground">
                    Your payment was canceled. No charges were made. You can retry your payment below.
                  </p>
                  <Button 
                    onClick={handleRetry}
                    className="w-full"
                    size="lg"
                  >
                    Retry Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

