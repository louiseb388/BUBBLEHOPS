import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const result = await requireAdmin(req);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data, error } = await result.admin
    .from('orders')
    .select('id,created_at,amount_total,currency,status,photo_url,email,metadata,stripe_session_id')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
