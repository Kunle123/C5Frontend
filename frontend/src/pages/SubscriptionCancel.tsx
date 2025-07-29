import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

const SubscriptionCancel = () => {
  const handleReturnToPricing = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-warning" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Subscription Not Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Your subscription was not completed. You can try again or choose a different plan.
              </p>
              <Button 
                onClick={handleReturnToPricing}
                className="w-full"
                size="lg"
              >
                Return to Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel; 