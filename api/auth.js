/* global process */

export async function requireAuthenticatedUser(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!token) {
    const error = new Error('You must be signed in to view Stripe payments.');
    error.statusCode = 401;
    throw error;
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    const error = new Error('Server authentication is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const error = new Error('Your session is invalid or has expired.');
    error.statusCode = 401;
    throw error;
  }
  return response.json();
}
