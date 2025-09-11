import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "../hooks/use-toast";

const Pricing = () => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [loadingTopUp, setLoadingTopUp] = useState(false);
  const [planIdMap, setPlanIdMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/subscriptions/plans");
        if (!res.ok) throw new Error("Failed to fetch plans");
        const plans = await res.json();
        // Assume each plan has a name and id
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

  // Payment handler for paid plans and top-up
  const handlePayment = async (plan: string, index?: number) => {
    console.log('handlePayment called with:', plan, index);
    console.log('Current planIdMap:', planIdMap);
    if (typeof index === 'number') setLoadingIndex(index);
    if (plan === 'Top-up') setLoadingTopUp(true);
    try {
      const token = localStorage.getItem("token") || "";
      const email = localStorage.getItem("user_email") || "";
      if (!token || !email) {
        toast({
          title: "Not logged in",
          description: "You must be logged in to purchase or upgrade a plan.",
          variant: "destructive",
        });
        setLoadingIndex(null);
        setLoadingTopUp(false);
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
        console.log('Selected plan_id:', plan_id);
        if (!plan_id) throw new Error("Plan ID not found for selected plan");
        res = await fetch(`/api/subscriptions/checkout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_id, email, return_url }),
        });
      } else if (plan === 'Top-up') {
        const query = `?user_id=${encodeURIComponent(email)}&plan=${encodeURIComponent(plan)}&return_url=${encodeURIComponent(return_url)}`;
        res = await fetch(`/api/payments/methods/add${query}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      if (!res || !res.ok) throw new Error("Failed to initiate payment");
      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "Failed to start payment",
        variant: "destructive",
      });
    } finally {
      setLoadingIndex(null);
      setLoadingTopUp(false);
    }
  };

  const mainPlans = [
    {
      name: "Free",
      price: "£0",
      period: "",
      description: "Get started with basic access",
      features: [
        "3 credits per month",
        "Up to 3 CVs per month",
        "Every CV comes with a tailored cover letter",
        "Every CV tailored to every job",
        "Keep an archive of your complete career history",
        "Basic access",
        "DocX CV downloads",
        "Email support"
      ],
      recommended: false,
      buttonText: "Get Started Free",
      buttonVariant: "default" as const
    },
    {
      name: "Monthly",
      price: "£24.99",
      period: "per month",
      description: "Perfect for career focused professionals",
      features: [
        "50 credits monthly recurring",
        "3 credits per day",
        "Create up to 140 CVs per month",
        "Every CV comes with a tailored cover letter",
        "Every CV tailored to every job",
        "Keep an archive of your complete career history",
        "Priority support",
        "Advanced features",
        "DocX CV downloads",
        "Cancel anytime"
      ],
      recommended: true,
      buttonText: "Start Monthly Plan",
      buttonVariant: "default" as const
    },
    {
      name: "Annual",
      price: "£199",
      period: "per year",
      description: "Best value with 33% discount",
      features: [
        "50 credits monthly recurring",
        "5 credits per day",
        "Create up to 200 CVs per month",
        "Every CV comes with a tailored cover letter",
        "Every CV tailored to every job",
        "Keep an archive of your complete career history",
        "Priority support",
        "Advanced features",
        "DocX CV downloads",
        "33% discount",
        "Cancel anytime"
      ],
      recommended: false,
      buttonText: "Choose Annual - Save 33%!",
      buttonVariant: "default" as const
    }
  ];

  const topUpPlan = {
    name: "Top-up",
    price: "£29.99",
    period: "one-off",
    description: "Pay as you go with no subscription",
    features: [
      "50 credits (one-off purchase)",
      "No subscription required",
      "Credits expire after 1 month",
      "Can be added to any plan",
      "Every CV comes with a tailored cover letter",
      "Every CV tailored to every job",
      "Keep an archive of your complete career history",
      "DocX CV downloads",
      "Email support"
    ],
    buttonText: "Buy Credits",
    buttonVariant: "default" as const
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your career journey. All plans include our AI-powered CV and cover letter generation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {mainPlans.map((plan, index) => (
            <Card key={index} className={`relative flex flex-col ${plan.recommended ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {plan.price}
                  </div>
                  <p className="text-muted-foreground">{plan.period}</p>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-between space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full"
                  size="lg"
                  disabled={plan.name !== 'Free' && loadingIndex === index}
                  onClick={plan.name === 'Free' ? undefined : () => { console.log('Button onClick fired for', plan.name, index); handlePayment(plan.name, index); }}
                >
                  {plan.name !== 'Free' && loadingIndex === index ? <span className="animate-spin mr-2">⏳</span> : null}
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="max-w-md mx-auto mb-12">
          <Card className="border-dashed border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-foreground">
                {topUpPlan.name}
              </CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {topUpPlan.price}
                </div>
                <p className="text-muted-foreground">{topUpPlan.period}</p>
                <p className="text-sm text-muted-foreground">
                  {topUpPlan.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {topUpPlan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={topUpPlan.buttonVariant} 
                className="w-full"
                size="lg"
                disabled={loadingTopUp}
                onClick={() => handlePayment('Top-up')}
              >
                {loadingTopUp ? <span className="animate-spin mr-2">⏳</span> : null}
                {topUpPlan.buttonText}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              All Plans Include
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">AI-powered CV generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Tailored cover letters</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Keyword matching analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Career Arc profile management</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Professional DocX exports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Mobile-responsive interface</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Secure data storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-success" />
                  <span className="text-foreground">Regular platform updates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Questions about our pricing? <a href="/faq" className="text-primary hover:underline">Check our FAQ</a> or contact us.
          </p>
          <p className="text-sm text-muted-foreground">
            All prices are in GBP. Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 