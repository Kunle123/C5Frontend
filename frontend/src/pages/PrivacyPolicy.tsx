import { Navigation } from "../components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Last updated: 27 July 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none space-y-6">
            <p className="text-foreground">
              This Privacy Policy describes how Candidate 5 collects, uses, and protects your personal information when you use our services.
            </p>
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Information We Collect</h2>
                <ul className="space-y-2 list-disc list-inside text-foreground">
                  <li>Personal identification information (name, email address, etc.)</li>
                  <li>Profile and CV data you provide</li>
                  <li>Usage data and cookies</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">How We Use Your Information</h2>
                <ul className="space-y-2 list-disc list-inside text-foreground">
                  <li>To provide and maintain our services</li>
                  <li>To communicate with you about your account or enquiries</li>
                  <li>To improve our services and user experience</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Cookies</h2>
                <p className="text-foreground">
                  We use cookies and similar technologies to enhance your experience, analyse usage, and provide essential site functionality. You can manage your cookie preferences in your browser settings. For more information, see our Cookie Policy (if available).
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Data Retention</h2>
                <p className="text-foreground">
                  We retain your personal data only as long as necessary to provide our services and fulfil the purposes described in this policy. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements. When your data is no longer needed, it will be securely deleted.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Third-Party Services</h2>
                <p className="text-foreground">
                  We may use trusted third-party service providers (such as hosting, analytics, and payment processors) to help operate our platform. These providers may process your data only as necessary to provide their services to us and are required to protect your information.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Children's Privacy</h2>
                <p className="text-foreground">
                  Our services are not intended for children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us at privacy@candidate5.co.uk and we will take steps to delete such information.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Your Rights</h2>
                <p className="text-foreground">
                  You have the right to access, correct, or delete your personal data, and to object to or restrict certain processing. To exercise your rights, please contact us at privacy@candidate5.co.uk.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Data Security</h2>
                <p className="text-foreground">
                  We implement appropriate technical and organisational measures to protect your data. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-primary mb-3">International Transfers</h2>
                <p className="text-foreground">
                  Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 