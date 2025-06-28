/**
 * lib/auth.ts
 * This file handles authentication and authorization for the CRM.
 * Why? Users need to log in securely and access only what they're allowed to see. This utility manages JWT tokens and user sessions.
 * How? It generates secure JWT tokens, validates them, and provides user context for RBAC.
 *
 * How to use: Import and use generateToken(), verifyToken(), and getUserFromToken() in API routes.
 */

import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { IUser } from '../models/User';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

// Define the JWT payload structure
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  realEstateId?: string | undefined;
  buildingId?: string | undefined;
  iat: number;
  exp: number;
}

// Define the user context for API routes
export interface UserContext {
  userId: string;
  email: string;
  role: string;
  realEstateId?: string | undefined;
  buildingId?: string | undefined;
}

/**
 * Generate a JWT token for a user after successful login.
 * The token contains user information needed for authorization.
 */
export function generateToken(user: IUser): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: (user as any)._id.toString(),
    email: user.email,
    role: user.role,
    realEstateId: user.realEstateId?.toString() || undefined,
    buildingId: user.buildingId?.toString() || undefined,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'realestatepro-crm',
    audience: 'realestatepro-crm-users',
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token.
 * Returns the user payload if valid, throws error if invalid.
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'realestatepro-crm',
      audience: 'realestatepro-crm-users',
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract user context from a JWT token.
 * Used in API routes to get current user information.
 */
export function getUserFromToken(token: string): UserContext {
  const payload = verifyToken(token);
  
  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    realEstateId: payload.realEstateId || undefined,
    buildingId: payload.buildingId || undefined,
  };
}

/**
 * Extract JWT token from request headers.
 * Looks for token in Authorization header (Bearer token).
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Get user context from request headers.
 * Combines token extraction and user context creation.
 */
export function getUserFromRequest(request: NextRequest): UserContext | null {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    
    return getUserFromToken(token);
  } catch (error) {
    return null;
  }
}

/**
 * Check if a user has a specific role.
 * Used for role-based access control.
 */
export function hasRole(user: UserContext, requiredRole: string): boolean {
  return user.role === requiredRole;
}

/**
 * Check if a user has any of the required roles.
 * Used for role-based access control with multiple allowed roles.
 */
export function hasAnyRole(user: UserContext, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

/**
 * Check if a user is a super admin.
 * Super admins have access to everything.
 */
export function isSuperAdmin(user: UserContext): boolean {
  return user.role === 'super_admin';
}

/**
 * Check if a user belongs to a specific real estate.
 * Used for multi-tenant data isolation.
 */
export function belongsToRealEstate(user: UserContext, realEstateId: string): boolean {
  return isSuperAdmin(user) || user.realEstateId === realEstateId;
}

/**
 * Check if a user belongs to a specific building.
 * Used for building-level access control.
 */
export function belongsToBuilding(user: UserContext, buildingId: string): boolean {
  return isSuperAdmin(user) || user.buildingId === buildingId;
} 