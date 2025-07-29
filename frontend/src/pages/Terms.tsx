import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Terms and Conditions
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Last updated: 27 July 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none space-y-6">
            <p className="text-foreground">
              Welcome to Candidate 5. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">1. About Us</h2>
                <p className="text-foreground">
                  Candidate 5 is a UK-based organisation providing CV and job application support services. For enquiries, contact enquiries@candidate5.co.uk.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">2. Definitions</h2>
                <div className="space-y-2">
                  <p className="text-foreground">
                    <strong>"Service"</strong> means the Candidate 5 website and related services.
                  </p>
                  <p className="text-foreground">
                    <strong>"User"</strong> means any person who accesses or uses the Service.
                  </p>
                  <p className="text-foreground">
                    <strong>"Content"</strong> means all information, data, text, images, and other material provided through the Service.
                  </p>
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">3. Use of Service</h2>
                <ul className="space-y-2 list-disc list-inside text-foreground">
                  <li>You must be at least 18 years old or have parental consent to use our services.</li>
                  <li>You agree to provide accurate information and not use the service for unlawful purposes.</li>
                  <li>We may suspend or terminate your access if you breach these terms.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">4. Account Security</h2>
                <p className="text-foreground">
                  You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorised use of your account.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">5. Intellectual Property</h2>
                <p className="text-foreground">
                  All content and materials on this site are the property of Candidate 5 or its licensors. You may not copy, reproduce, or distribute any content without permission.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">6. Limitation of Liability</h2>
                <p className="text-foreground">
                  We provide our services "as is" and make no guarantees regarding accuracy or suitability. To the fullest extent permitted by law, Candidate 5 is not liable for any loss or damage arising from your use of our services.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">7. User Content</h2>
                <p className="text-foreground">
                  You retain ownership of content you submit but grant us a licence to use it for providing our services.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">8. Termination</h2>
                <p className="text-foreground">
                  Either party may terminate this agreement at any time. Upon termination, your right to use our services will cease immediately.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms; 