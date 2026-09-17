import { createClient, SupabaseClient } from '@supabase/supabase-js';

type AdminResult = { admin: SupabaseClient } | { error: string; status: number };

/** Verifies the request's bearer token (the caller's Supabase access token, sent from
 * app/admin/page.tsx) belongs to ADMIN_EMAIL, using the service-role client — the only
 * client able to validate a token without already knowing whose it is. Returns that same
 * service-role client for the route to reuse (it can read/write every customer's orders,
 * bypassing RLS, which is exactly what /admin needs and no other route should have). */
export async function requireAdmin(req: Request): Promise<AdminResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!url || !serviceKey || !adminEmail) {
    return { error: 'Admin area not configured — set SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL.', status: 500 };
  }

  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: 'Not signed in.', status: 401 };

  const admin = createClient(url, serviceKey);
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user?.email) return { error: 'Not signed in.', status: 401 };
  if (data.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { error: 'Not authorized.', status: 403 };
  }
  return { admin };
}
