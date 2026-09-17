import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';
import { SITE } from '@/lib/data';

const EXT_BY_TYPE: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requireAdmin(req);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
  const { admin } = result;

  const form = await req.formData();
  const status = form.get('status');
  const photo = form.get('photo');
  if (typeof status !== 'string') {
    return NextResponse.json({ error: 'Missing status.' }, { status: 400 });
  }

  const { data: before } = await admin.from('orders').select('status').eq('id', params.id).single();

  const update: { status: string; photo_url?: string } = { status };
  let photoBuffer: Buffer | null = null;
  let photoExt = 'jpg';

  if (photo instanceof File && photo.size > 0) {
    photoBuffer = Buffer.from(await photo.arrayBuffer());
    photoExt = EXT_BY_TYPE[photo.type] || 'jpg';
    const path = `${params.id}-${Date.now()}.${photoExt}`;
    const { error: uploadError } = await admin.storage
      .from('order-photos')
      .upload(path, photoBuffer, { contentType: photo.type || 'image/jpeg' });
    if (uploadError) return NextResponse.json({ error: `Photo upload failed: ${uploadError.message}` }, { status: 500 });
    update.photo_url = admin.storage.from('order-photos').getPublicUrl(path).data.publicUrl;
  }

  const { data: order, error } = await admin
    .from('orders')
    .update(update)
    .eq('id', params.id)
    .select('email,metadata,photo_url')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Only email on the transition into "painting", not every save while it's already there —
  // status can be nudged back and forth (e.g. correcting a mistake) without re-sending.
  if (status === 'painting' && before?.status !== 'painting' && order?.email) {
    const meta = (order.metadata || {}) as { delivery_name?: string };
    const firstName = meta.delivery_name?.trim().split(/\s+/)[0];
    await sendEmail({
      to: order.email,
      subject: 'Your BUBBLEHOPS pair is being painted',
      text: [
        `Hey${firstName ? ` ${firstName}` : ''} — good news, we've started painting your pair.`,
        '',
        "It usually takes about three days from here. We'll email you a photo of the finished pair before it ships.",
        '',
        `Check on it any time at ${SITE.url}/account.`
      ].join('\n'),
      html: `
        <p>Hey${firstName ? ` ${firstName}` : ''} — good news, we've started painting your pair.</p>
        <p>It usually takes about three days from here. We'll email you a photo of the finished pair before it ships.</p>
        <p>Check on it any time at <a href="${SITE.url}/account">${SITE.url}/account</a>.</p>
      `
    });
  }

  // Only email the customer when a new photo actually came in with this request — status
  // can otherwise be nudged back and forth (e.g. correcting a mistake) without re-sending.
  if (photoBuffer && order?.email) {
    const meta = (order.metadata || {}) as { delivery_name?: string };
    const firstName = meta.delivery_name?.trim().split(/\s+/)[0];
    await sendEmail({
      to: order.email,
      subject: 'Your BUBBLEHOPS pair is ready for a look!',
      text: [
        `Hey${firstName ? ` ${firstName}` : ''} — here's a first look at your finished pair (attached).`,
        '',
        "If anything needs a tweak, just reply to this email within 24 hours and we'll sort it before it ships.",
        "Otherwise we'll get them packed and posted.",
        '',
        `View it any time at ${SITE.url}/account.`
      ].join('\n'),
      html: `
        <p>Hey${firstName ? ` ${firstName}` : ''} — here's a first look at your finished pair.</p>
        <p><img src="${update.photo_url}" alt="Your finished BUBBLEHOPS trainers" style="max-width:480px;width:100%;height:auto;" /></p>
        <p>If anything needs a tweak, just reply to this email within 24 hours and we'll sort it before it ships. Otherwise we'll get them packed and posted.</p>
        <p>View it any time at <a href="${SITE.url}/account">${SITE.url}/account</a>.</p>
      `,
      attachments: [{ filename: `bubblehops-order-photo.${photoExt}`, content: photoBuffer.toString('base64') }]
    });
  }

  return NextResponse.json({ ok: true, photo_url: order?.photo_url ?? null });
}
