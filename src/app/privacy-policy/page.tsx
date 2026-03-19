// app/privacy-policy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>Privacy Policy</h1>
      <p>
        Last updated:{' '}
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        When you log in using Google or Facebook, we collect the following information from your
        social media profile:
      </p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Profile picture</li>
        <li>Social media account ID</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Create and manage your account</li>
        <li>Provide and personalize our services</li>
        <li>Send you order confirmations and updates</li>
        <li>Respond to your comments and questions</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share your
        information only in the following cases:
      </p>
      <ul>
        <li>With your consent</li>
        <li>To comply with legal obligations</li>
        <li>To protect our rights and prevent fraud</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal data for as long as your account is active. You may request deletion
        of your data at any time by contacting us at{' '}
        <a href='mailto:support@yourdomain.com'>support@yourdomain.com</a>.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Withdraw consent at any time</li>
      </ul>

      <h2>6. Cookies</h2>
      <p>
        We use cookies to maintain your login session. These cookies are essential for the app to
        function and do not track you across other websites.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at{' '}
        <a href='mailto:support@yourdomain.com'>support@yourdomain.com</a>.
      </p>
    </div>
  )
}
