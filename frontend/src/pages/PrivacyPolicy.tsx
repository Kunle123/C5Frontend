import React from 'react';

const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

const PrivacyPolicy: React.FC = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, color: '#2D3748' }}>Privacy Policy</h1>
    <p style={{ color: '#718096', marginBottom: 24 }}>Last updated: {today}</p>
    <section style={{ marginBottom: 32 }}>
      <p>
        Candidate 5 ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. We are based in the United Kingdom and comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Information We Collect</h2>
      <ul style={{ marginLeft: 24 }}>
        <li>Personal identification information (name, email address, etc.)</li>
        <li>Profile and CV data you provide</li>
        <li>Usage data and cookies</li>
      </ul>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>How We Use Your Information</h2>
      <ul style={{ marginLeft: 24 }}>
        <li>To provide and maintain our services</li>
        <li>To communicate with you about your account or enquiries</li>
        <li>To improve our services and user experience</li>
        <li>To comply with legal obligations</li>
      </ul>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Cookies</h2>
      <p>
        We use cookies and similar technologies to enhance your experience, analyse usage, and provide essential site functionality. You can manage your cookie preferences in your browser settings. For more information, see our Cookie Policy (if available).
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Data Retention</h2>
      <p>
        We retain your personal data only as long as necessary to provide our services and fulfil the purposes described in this policy. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements. When your data is no longer needed, it will be securely deleted.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Third-Party Services</h2>
      <p>
        We may use trusted third-party service providers (such as hosting, analytics, and payment processors) to help operate our platform. These providers may process your data only as necessary to provide their services to us and are required to protect your information.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Children’s Privacy</h2>
      <p>
        Our services are not intended for children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us at <a href="mailto:privacy@candidate5.co.uk">privacy@candidate5.co.uk</a> and we will take steps to delete such information.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal data, and to object to or restrict certain processing. To exercise your rights, please contact us at <a href="mailto:privacy@candidate5.co.uk">privacy@candidate5.co.uk</a>.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Data Security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect your data. However, no method of transmission over the internet is 100% secure.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>International Transfers</h2>
      <p>
        Your data may be processed outside the UK, but we ensure adequate safeguards are in place.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Complaints</h2>
      <p>
        If you have concerns about how we handle your data, please contact us at <a href="mailto:privacy@candidate5.co.uk">privacy@candidate5.co.uk</a>. You also have the right to lodge a complaint with the UK Information Commissioner’s Office (ICO): <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer">https://ico.org.uk/</a>.
      </p>
    </section>
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Contact Us</h2>
      <p>
        For privacy-related enquiries, please email <a href="mailto:privacy@candidate5.co.uk">privacy@candidate5.co.uk</a>.
      </p>
    </section>
    <section>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2B6CB0', marginBottom: 8 }}>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
      </p>
    </section>
  </div>
);

export default PrivacyPolicy; 