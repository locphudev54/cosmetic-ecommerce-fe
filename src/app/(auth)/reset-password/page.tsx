import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'

/**
 * This page is accessed via a link sent to the user's email for password reset.
 * e.g., https://your-frontend.com/reset-password?token=resetPasswordToken
 */
export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
