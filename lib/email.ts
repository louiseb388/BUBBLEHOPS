import { SITE } from './data';

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Base64-encoded file content. */
  attachments?: { filename: string; content: string }[];
};

/** Every server-side email in this app goes through here (contact form, order
 * notifications, order-photo-ready) so there's one place that knows about
 * BREVO_API_KEY and the shared "log instead of send" fallback when it's unset.
 * Uses Brevo's Transactional Email API — the same account/verified sending
 * domain (bubblehops.com) already set up for Supabase's auth emails, so no
 * separate provider or domain verification is needed. */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; skipped?: boolean }> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.log(`[email] BREVO_API_KEY not set — not sent: "${input.subject}" -> ${input.to}`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'BUBBLEHOPS', email: `noreply@${new URL(SITE.url).hostname}` },
        to: [{ email: input.to }],
        subject: input.subject,
        textContent: input.text,
        // htmlContent is mandatory for Brevo's API — callers that only pass plain text
        // (e.g. the contact form) get a minimal auto-generated version instead.
        htmlContent: input.html || `<pre style="font:inherit;white-space:pre-wrap;">${escapeHtml(input.text)}</pre>`,
        ...(input.replyTo ? { replyTo: { email: input.replyTo } } : {}),
        ...(input.attachments
          ? { attachment: input.attachments.map((a) => ({ name: a.filename, content: a.content })) }
          : {})
      })
    });
    if (!res.ok) throw new Error(`Brevo responded ${res.status}: ${await res.text()}`);
    return { ok: true };
  } catch (e) {
    console.error(`Email failed to send: "${input.subject}" -> ${input.to}`, e);
    return { ok: false };
  }
}
