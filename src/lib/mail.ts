/**
 * Email delivery seam. Currently a stub that logs to the server console so the
 * flows work end-to-end in development. A real provider (Resend/SMTP) is wired
 * in here during the notifications milestone — callers don't change.
 */
type Mail = { to: string; subject: string; text: string };

export async function sendMail({ to, subject, text }: Mail): Promise<void> {
  // TODO(notifications): replace with a real email provider.
  console.log(`\n[mail] to: ${to}\n[mail] subject: ${subject}\n[mail] ${text}\n`);
}

export async function sendPasswordResetEmail(to: string, link: string): Promise<void> {
  await sendMail({
    to,
    subject: "Reset your Blue Fox password",
    text: `We received a request to reset your password. Use this link within 1 hour:\n${link}\n\nIf you didn't request this, you can ignore this email.`,
  });
}
