/**
 * app/api/auth/login/route.ts
 * This file handles user login authentication.
 * Why? Users need to log in to access the CRM. This endpoint validates credentials and provides a secure token.
 * How? It checks email/password against the database, generates a JWT token, and logs the login attempt.
 *
 * How to use: Send POST request with email and password to /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';
import { userActionLogger, errorLogger } from '@/lib/logging';
import { checkRateLimit } from '@/lib/middleware';

// Define the login request body structure
interface LoginRequest {
  email: string;
  password: string;
}

// Define the login response structure
interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    realEstateId?: string | undefined;
    buildingId?: string | undefined;
  };
}

/**
 * POST /api/auth/login
 * Authenticates a user with email and password.
 * Returns a JWT token for subsequent API calls.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limiting (5 attempts per minute per IP)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIP, 5, 60000)) {
      errorLogger.warn({
        action: 'rate_limit_exceeded',
        ip: clientIP,
        email: email.toLowerCase(),
        timestamp: new Date(),
      });

      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Log failed login attempt (user not found)
      userActionLogger.warn({
        action: 'login_failed',
        email: email.toLowerCase(),
        reason: 'user_not_found',
        ip: clientIP,
        timestamp: new Date(),
      });

      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      userActionLogger.warn({
        action: 'login_failed',
        email: user.email,
        reason: 'account_inactive',
        ip: clientIP,
        timestamp: new Date(),
      });

      return NextResponse.json(
        { success: false, message: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Log failed login attempt (wrong password)
      userActionLogger.warn({
        action: 'login_failed',
        email: user.email,
        reason: 'invalid_password',
        ip: clientIP,
        timestamp: new Date(),
      });

      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Log successful login
    userActionLogger.info({
      action: 'login_successful',
      user: user.email,
      role: user.role,
      realEstateId: user.realEstateId?.toString(),
      buildingId: user.buildingId?.toString(),
      ip: clientIP,
      timestamp: new Date(),
    });

    // Return success response with token and user info
    const response: LoginResponse = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        realEstateId: user.realEstateId?.toString() || undefined,
        buildingId: user.buildingId?.toString() || undefined,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // Log unexpected errors
    errorLogger.error({
      action: 'login_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
    });

    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
} 