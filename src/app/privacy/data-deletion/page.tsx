// app/privacy/data-deletion/page.tsx
export default function DataDeletionPage() {
  return (
    <div>
      <h1>Data Deletion Instructions</h1>
      <p>
        If you want to delete your account and all associated data from our app, you can do so by
        following these steps:
      </p>
      <ol>
        <li>
          Log in to your account at <strong>yourdomain.com</strong>
        </li>
        <li>
          Go to <strong>Settings</strong> → <strong>Account</strong>
        </li>
        <li>
          Click <strong>Delete My Account</strong>
        </li>
      </ol>
      <p>
        Alternatively, you can send a deletion request directly to us by email at{' '}
        <strong>support@yourdomain.com</strong> with the subject line{' '}
        <strong>Data Deletion Request</strong>. We will process your request within 30 days.
      </p>
      <p>
        When your account is deleted, we remove all personal data including your name, email
        address, and any other information associated with your Facebook login.
      </p>
    </div>
  )
}
