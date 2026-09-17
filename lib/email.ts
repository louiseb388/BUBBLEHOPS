import { SITE } from './data';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Resend expects base64-encoded file content. */
  attachments?: { filename: string; content: string }[];
};

/** Every server-side email in this app goes through here (contact form, order
 * notifications, order-photo-ready) so there's one place that knows about
 * RESEND_API_KEY and the shared "log instead of send" fallback when it's unset. */
export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; skipped?: boolean }> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[email] RESEND_API_KEY not set — not sent: "${input.subject}" -> ${input.to}`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `BUBBLEHOPS <noreply@${new URL(SITE.url).hostname}>`,
        to: input.to,
        subject: input.subject,
        text: input.text,
        ...(input.html ? { html: input.html } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.attachments ? { attachments: input.attachments } : {})
      })
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return { ok: true };
  } catch (e) {
    console.error(`Email failed to send: "${input.subject}" -> ${input.to}`, e);
    return { ok: false };
  }
}
