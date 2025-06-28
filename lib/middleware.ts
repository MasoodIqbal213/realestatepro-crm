/**
 * lib/middleware.ts
 * This file provides middleware functions for protecting API routes.
 * Why? Not all users should access all parts of the system. This middleware checks user permissions before allowing access.
 * How? It verifies JWT tokens and checks if the user has the required role or permissions.
 *
 * How to use: Import and use requireAuth(), requireRole(), or requirePermission() in API routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { userActionLogger, errorLogger } from './logging';
import jwt from 'jsonwebtoken';

// Define the middleware response type
interface MiddlewareResponse {
  success: boolean;
  message: string;
  user?: any;
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Define user roles and their hierarchy
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SALES: 'sales',
  MAINTENANCE: 'maintenance',
  TENANT: 'tenant',
  RECEPTIONIST: 'receptionist'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.SUPER_ADMIN]: 6,
  [ROLES.ADMIN]: 5,
  [ROLES.SALES]: 4,
  [ROLES.MAINTENANCE]: 3,
  [ROLES.RECEPTIONIST]: 2,
  [ROLES.TENANT]: 1
};

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  realEstateId?: string;
  buildingId?: string;
  iat: number;
  exp: number;
}

/**
 * Verify JWT token and extract user information
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Check if user has required role or higher
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user has access to specific real estate
 */
export function hasRealEstateAccess(
  userRealEstateId: string | undefined,
  targetRealEstateId: string | undefined,
  userRole: UserRole
): boolean {
  // Super admin can access all real estates
  if (userRole === ROLES.SUPER_ADMIN) {
    return true;
  }
  
  // If no target real estate specified, allow access
  if (!targetRealEstateId) {
    return true;
  }
  
  // User must belong to the same real estate
  return userRealEstateId === targetRealEstateId;
}

/**
 * Check if user has access to specific building
 */
export function hasBuildingAccess(
  userBuildingId: string | undefined,
  targetBuildingId: string | undefined,
  userRole: UserRole
): boolean {
  // Super admin and admin can access all buildings in their real estate
  if (userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN) {
    return true;
  }
  
  // If no target building specified, allow access
  if (!targetBuildingId) {
    return true;
  }
  
  // User must be assigned to the same building
  return userBuildingId === targetBuildingId;
}

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    try {
      const token = extractToken(request);
      
      if (!token) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication token required',
            code: 'MISSING_TOKEN'
          },
          { status: 401 }
        );
      }
      
      const payload = verifyToken(token);
      
      if (!payload) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN'
          },
          { status: 401 }
        );
      }
      
      // Add user info to request headers for downstream handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-role', payload.role);
      if (payload.realEstateId) {
        requestHeaders.set('x-real-estate-id', payload.realEstateId);
      }
      if (payload.buildingId) {
        requestHeaders.set('x-building-id', payload.buildingId);
      }
      
      // Create new request with user headers
      const authenticatedRequest = new NextRequest(request, {
        headers: requestHeaders
      });
      
      return handler(authenticatedRequest);
      
    } catch (error) {
      userActionLogger.error({
        action: 'auth_middleware_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Role-based authorization middleware
 * Ensures user has required role or higher
 */
export function withRole(requiredRole: UserRole, handler: Function) {
  return withAuth(async (request: NextRequest) => {
    try {
      const userRole = request.headers.get('x-user-role') as UserRole;
      
      if (!hasRole(userRole, requiredRole)) {
        userActionLogger.warn({
          action: 'insufficient_permissions',
          userId: request.headers.get('x-user-id'),
          userRole,
          requiredRole,
          endpoint: request.url,
          timestamp: new Date()
        });
        
        return NextResponse.json(
          {
            success: false,
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_PERMISSIONS'
          },
          { status: 403 }
        );
      }
      
      return handler(request);
      
    } catch (error) {
      userActionLogger.error({
        action: 'role_middleware_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization failed',
          code: 'AUTHZ_ERROR'
        },
        { status: 500 }
      );
    }
  });
}

/**
 * Real estate access middleware
 * Ensures user has access to the specified real estate
 */
export function withRealEstateAccess(handler: Function) {
  return withAuth(async (request: NextRequest) => {
    try {
      const userRole = request.headers.get('x-user-role') as UserRole;
      const userRealEstateId = request.headers.get('x-real-estate-id');
      const targetRealEstateId = request.nextUrl.searchParams.get('realEstateId');
      
      if (!hasRealEstateAccess(userRealEstateId || undefined, targetRealEstateId || undefined, userRole)) {
        userActionLogger.warn({
          action: 'real_estate_access_denied',
          userId: request.headers.get('x-user-id'),
          userRealEstateId,
          targetRealEstateId,
          userRole,
          endpoint: request.url,
          timestamp: new Date()
        });
        
        return NextResponse.json(
          {
            success: false,
            error: 'Access denied to this real estate',
            code: 'REAL_ESTATE_ACCESS_DENIED'
          },
          { status: 403 }
        );
      }
      
      return handler(request);
      
    } catch (error) {
      userActionLogger.error({
        action: 'real_estate_access_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Real estate access check failed',
          code: 'REAL_ESTATE_ACCESS_ERROR'
        },
        { status: 500 }
      );
    }
  });
}

/**
 * Building access middleware
 * Ensures user has access to the specified building
 */
export function withBuildingAccess(handler: Function) {
  return withAuth(async (request: NextRequest) => {
    try {
      const userRole = request.headers.get('x-user-role') as UserRole;
      const userBuildingId = request.headers.get('x-building-id');
      const targetBuildingId = request.nextUrl.searchParams.get('buildingId');
      
      if (!hasBuildingAccess(userBuildingId || undefined, targetBuildingId || undefined, userRole)) {
        userActionLogger.warn({
          action: 'building_access_denied',
          userId: request.headers.get('x-user-id'),
          userBuildingId,
          targetBuildingId,
          userRole,
          endpoint: request.url,
          timestamp: new Date()
        });
        
        return NextResponse.json(
          {
            success: false,
            error: 'Access denied to this building',
            code: 'BUILDING_ACCESS_DENIED'
          },
          { status: 403 }
        );
      }
      
      return handler(request);
      
    } catch (error) {
      userActionLogger.error({
        action: 'building_access_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Building access check failed',
          code: 'BUILDING_ACCESS_ERROR'
        },
        { status: 500 }
      );
    }
  });
}

/**
 * Get user info from request headers
 */
export function getUserFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-user-id')!,
    email: request.headers.get('x-user-email')!,
    role: request.headers.get('x-user-role') as UserRole,
    realEstateId: request.headers.get('x-real-estate-id') || undefined,
    buildingId: request.headers.get('x-building-id') || undefined
  };
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

  if (!hasRole(user.role, requiredRole as UserRole)) {
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

  if (!requiredRoles.every(role => hasRole(user.role, role as UserRole))) {
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

  if (!hasRole(user.role, ROLES.SUPER_ADMIN)) {
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
export function createSuccessResponse(data: any, user?: any): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    user: user ? {
      userId: user.id,
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