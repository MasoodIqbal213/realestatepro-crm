/**
 * lib/middleware.ts
 * This file provides middleware functions for protecting API routes.
 * Why? Not all users should access all parts of the system. This middleware checks user permissions before allowing access.
 * How? It verifies JWT tokens and checks if the user has the required role or permissions.
 *
 * How to use: Import and use requireAuth(), requireRole(), or requirePermission() in API routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, UserContext, hasRole, hasAnyRole, isSuperAdmin } from './auth';
import { userActionLogger, errorLogger } from './logging';

// Define the middleware response type
interface MiddlewareResponse {
  success: boolean;
  message: string;
  user?: UserContext;
}

/**
 * Middleware that requires a valid JWT token.
 * Used for any protected route that needs authentication.
 */
export function requireAuth(request: NextRequest): MiddlewareResponse {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return {
        success: false,
        message: 'Authentication required. Please log in.',
      };
    }

    // Log successful authentication
    userActionLogger.info({
      user: user.email,
      action: 'api_access',
      endpoint: request.url,
      method: request.method,
      timestamp: new Date(),
    });

    return {
      success: true,
      message: 'Authentication successful',
      user,
    };
  } catch (error) {
    errorLogger.error({
      error: 'Authentication middleware error',
      details: error,
      endpoint: request.url,
      timestamp: new Date(),
    });

    return {
      success: false,
      message: 'Authentication failed. Please log in again.',
    };
  }
}

/**
 * Middleware that requires a specific role.
 * Used for routes that only certain roles can access.
 */
export function requireRole(request: NextRequest, requiredRole: string): MiddlewareResponse {
  const authResult = requireAuth(request);
  
  if (!authResult.success) {
    return authResult;
  }

  const user = authResult.user!;

  if (!hasRole(user, requiredRole)) {
    // Log unauthorized access attempt
    userActionLogger.warn({
      user: user.email,
      action: 'unauthorized_access',
      endpoint: request.url,
      method: request.method,
      requiredRole,
      userRole: user.role,
      timestamp: new Date(),
    });

    return {
      success: false,
      message: `Access denied. Required role: ${requiredRole}`,
    };
  }

  return {
    success: true,
    message: 'Role verification successful',
    user,
  };
}

/**
 * Middleware that requires any of the specified roles.
 * Used for routes that multiple roles can access.
 */
export function requireAnyRole(request: NextRequest, requiredRoles: string[]): MiddlewareResponse {
  const authResult = requireAuth(request);
  
  if (!authResult.success) {
    return authResult;
  }

  const user = authResult.user!;

  if (!hasAnyRole(user, requiredRoles)) {
    // Log unauthorized access attempt
    userActionLogger.warn({
      user: user.email,
      action: 'unauthorized_access',
      endpoint: request.url,
      method: request.method,
      requiredRoles,
      userRole: user.role,
      timestamp: new Date(),
    });

    return {
      success: false,
      message: `Access denied. Required roles: ${requiredRoles.join(', ')}`,
    };
  }

  return {
    success: true,
    message: 'Role verification successful',
    user,
  };
}

/**
 * Middleware that requires super admin access.
 * Used for system-wide administrative functions.
 */
export function requireSuperAdmin(request: NextRequest): MiddlewareResponse {
  const authResult = requireAuth(request);
  
  if (!authResult.success) {
    return authResult;
  }

  const user = authResult.user!;

  if (!isSuperAdmin(user)) {
    // Log unauthorized access attempt
    userActionLogger.warn({
      user: user.email,
      action: 'unauthorized_super_admin_access',
      endpoint: request.url,
      method: request.method,
      userRole: user.role,
      timestamp: new Date(),
    });

    return {
      success: false,
      message: 'Access denied. Super admin privileges required.',
    };
  }

  return {
    success: true,
    message: 'Super admin verification successful',
    user,
  };
}

/**
 * Helper function to create a NextResponse for middleware failures.
 * Used to return proper HTTP responses from API routes.
 */
export function createErrorResponse(message: string, status: number = 401): NextResponse {
  return NextResponse.json(
    { 
      success: false, 
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Helper function to create a success response with user context.
 * Used to return proper HTTP responses from API routes.
 */
export function createSuccessResponse(data: any, user?: UserContext): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    user: user ? {
      userId: user.userId,
      email: user.email,
      role: user.role,
    } : undefined,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Rate limiting helper (basic implementation).
 * Prevents abuse by limiting requests per user.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = `rate_limit:${userId}`;
  const userLimit = rateLimitMap.get(key);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
} 