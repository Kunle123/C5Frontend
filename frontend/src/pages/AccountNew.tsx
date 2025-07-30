import { Navigation } from "../components/Navigation";
import ProfileSettings from "../components/ProfileSettings";
import SubscriptionSection from "../components/SubscriptionSection";

const AccountNew = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ProfileSettings />
      <SubscriptionSection />
    </div>
  );
};

export default AccountNew; 
