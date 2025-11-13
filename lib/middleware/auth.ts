import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { User } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return session.user;
}

/**
 * Middleware to check user role
 */
export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest) => {
    const user = await requireAuth(request);

    if (user instanceof NextResponse) {
      return user; // Return error response
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return user;
  };
}

/**
 * Check if user has admin or super_admin role
 */
export async function requireAdmin(request: NextRequest) {
  return requireRole(['admin', 'super_admin'])(request);
}

/**
 * Check if user has manager role or higher
 */
export async function requireManager(request: NextRequest) {
  return requireRole(['manager', 'admin', 'super_admin'])(request);
}

/**
 * Helper to extract user from request
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}
