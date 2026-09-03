import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/lib/data';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.message || !body.topic) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  const { topic, name, email, message } = body as { topic: string; name?: string; email: string; message: string };

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `BUBBLEHOPS website <noreply@${new URL(SITE.url).hostname}>`,
          to: SITE.email,
          reply_to: email,
          subject: `[${topic}] New message from ${name || email}`,
          text: `Topic: ${topic}\nName: ${name || '—'}\nEmail: ${email}\n\n${message}`
        })
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error('Contact email failed to send', e);
      return NextResponse.json({ ok: false, error: 'Could not send right now — please email us directly.' }, { status: 502 });
    }
  }

  // No email provider configured — log server-side so the form still "works" in dev/preview.
  console.log('[contact form]', { topic, name, email, message });
  return NextResponse.json({ ok: true, note: 'RESEND_API_KEY not set — message logged, not emailed.' });
}
