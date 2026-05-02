import { verifyToken } from './auth';

export async function authenticate(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);

  if (!payload) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  return { user: payload };
}

export function requireAdmin(user) {
  if (user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  return null;
}
