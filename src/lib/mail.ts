/**
 * Email delivery + notification templates.
 *
 * Delivery uses Resend when RESEND_API_KEY is set (no SDK — a plain fetch to
 * their REST API); otherwise it logs to the server console so every flow works
 * end-to-end in development. To go live, set RESEND_API_KEY and MAIL_FROM in
 * the environment — no code changes needed.
 */
type Mail = { to: string; subject: string; text: string };

const FROM = process.env.MAIL_FROM || "Blue Fox Dubai <onboarding@resend.dev>";
const money = (cents: number) => "$" + (cents / 100).toFixed(2);

export async function sendMail({ to, subject, text }: Mail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`\n[mail] to: ${to}\n[mail] subject: ${subject}\n[mail] ${text}\n`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, text }),
    });
    if (!res.ok) console.error(`[mail] send failed (${res.status}): ${await res.text()}`);
  } catch (e) {
    console.error("[mail] send error:", e);
  }
}

export async function sendPasswordResetEmail(to: string, link: string): Promise<void> {
  await sendMail({
    to,
    subject: "Reset your Blue Fox password",
    text: `We received a request to reset your password. Use this link within 1 hour:\n${link}\n\nIf you didn't request this, you can ignore this email.`,
  });
}

/* ─────────────────────────── Notifications ─────────────────────────── */

export async function notifyDepositConfirmed(to: string, name: string, amountCents: number) {
  await sendMail({
    to,
    subject: "Your deposit is confirmed",
    text: `Hi ${name},\n\nYour deposit of ${money(amountCents)} has been confirmed and credited to your Blue Fox wallet. You can now rent a robot and start earning.\n\n— Blue Fox Dubai`,
  });
}

export async function notifyEarningCredited(to: string, name: string, amountCents: number, robot: string) {
  await sendMail({
    to,
    subject: "Monthly return credited",
    text: `Hi ${name},\n\nA monthly return of ${money(amountCents)} from your ${robot} has been credited to your wallet.\n\n— Blue Fox Dubai`,
  });
}

export async function notifyWithdrawalPaid(to: string, name: string, amountCents: number) {
  await sendMail({
    to,
    subject: "Your withdrawal has been paid",
    text: `Hi ${name},\n\nYour withdrawal of ${money(amountCents)} has been processed. Thank you for choosing Blue Fox.\n\n— Blue Fox Dubai`,
  });
}

export async function notifyKycDecision(to: string, name: string, approved: boolean, reason?: string) {
  await sendMail({
    to,
    subject: approved ? "Identity verified" : "Identity verification update",
    text: approved
      ? `Hi ${name},\n\nYour identity has been verified. Withdrawals are now enabled on your account.\n\n— Blue Fox Dubai`
      : `Hi ${name},\n\nWe couldn't approve your verification. Reason: ${reason ?? "—"}\n\nPlease re-submit clear documents from your account.\n\n— Blue Fox Dubai`,
  });
}
