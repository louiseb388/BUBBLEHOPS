import { NextRequest, NextResponse } from 'next/server';
import { SITE } from '@/lib/data';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.email || !body.message || !body.topic) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  const { topic, name, email, message } = body as { topic: string; name?: string; email: string; message: string };

  const result = await sendEmail({
    to: SITE.email,
    replyTo: email,
    subject: `[${topic}] New message from ${name || email}`,
    text: `Topic: ${topic}\nName: ${name || '—'}\nEmail: ${email}\n\n${message}`
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'Could not send right now — please email us directly.' }, { status: 502 });
  }
  return NextResponse.json(result.skipped ? { ok: true, note: 'RESEND_API_KEY not set — message logged, not emailed.' } : { ok: true });
}
