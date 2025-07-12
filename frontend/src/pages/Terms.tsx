import React from 'react';

const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

const Terms: React.FC = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, color: '#2D3748' }}>Terms and Conditions</h1>
    <p style={{ color: '#718096', marginBottom: 24 }}>Last updated: {today}</p>
    <section style={{ marginBottom: 32 }}>
      <p>
        Welcome to Candidate 5. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>1. About Us</h2>
      <p>
        Candidate 5 is a UK-based organisation providing CV and job application support services. For enquiries, contact <a href="mailto:enquiries@candidate5.co.uk">enquiries@candidate5.co.uk</a>.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>2. Definitions</h2>
      <ul style={{ marginLeft: 24 }}>
        <li><b>"Service"</b> means the Candidate 5 website and related services.</li>
        <li><b>"User"</b> means any person who accesses or uses the Service.</li>
        <li><b>"Content"</b> means all information, data, text, images, and other material provided through the Service.</li>
      </ul>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>3. Use of Service</h2>
      <ul style={{ marginLeft: 24 }}>
        <li>You must be at least 18 years old or have parental consent to use our services.</li>
        <li>You agree to provide accurate information and not use the service for unlawful purposes.</li>
        <li>We may suspend or terminate your access if you breach these terms.</li>
      </ul>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>4. Account Security</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorised use of your account.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>5. Intellectual Property</h2>
      <p>
        All content and materials on this site are the property of Candidate 5 or its licensors. You may not copy, reproduce, or distribute any content without permission.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>6. Limitation of Liability</h2>
      <p>
        We provide our services "as is" and make no guarantees regarding accuracy or suitability. To the fullest extent permitted by law, Candidate 5 is not liable for any loss or damage arising from your use of our services.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>7. User Content</h2>
      <p>
        You retain ownership of content you submit but grant us a licence to use it for providing our services.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account at our discretion, including for breach of these terms or misuse of the Service.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>9. Changes to Service</h2>
      <p>
        We may modify, suspend, or discontinue any part of the Service at any time, with or without notice.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>10. Dispute Resolution</h2>
      <p>
        Any disputes arising from these Terms will be governed by the laws of England and Wales. We encourage you to contact us first to resolve any issues amicably.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>11. Privacy</h2>
      <p>
        Please refer to our <a href="/privacy-policy">Privacy Policy</a> for information on how we handle your data.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>12. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of our services constitutes acceptance of the new terms.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of England and Wales.
      </p>
    </section>
    <section>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>14. Contact</h2>
      <p>
        For any questions about these Terms, please contact <a href="mailto:enquiries@candidate5.co.uk">enquiries@candidate5.co.uk</a>.
      </p>
    </section>
  </div>
);

export default Terms; 