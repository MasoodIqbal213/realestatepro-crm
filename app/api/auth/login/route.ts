/**
 * app/api/auth/login/route.ts
 * Login endpoint for user authentication
 * Handles JWT token generation and user validation
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { userActionLogger } from '@/lib/logging';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * 
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password, return JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@realestatepro.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         role:
 *                           type: string
 *                         realEstateId:
 *                           type: string
 *                         buildingId:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        },
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      userActionLogger.warn({
        action: 'login_failed_user_not_found',
        email: email.toLowerCase(),
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      userActionLogger.warn({
        action: 'login_failed_inactive_user',
        userId: user._id,
        email: user.email,
        isActive: user.isActive,
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Account is not active. Please contact your administrator.',
          code: 'ACCOUNT_INACTIVE'
        },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      userActionLogger.warn({
        action: 'login_failed_invalid_password',
        userId: user._id,
        email: user.email,
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date()
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      realEstateId: user.realEstateId,
      buildingId: user.buildingId
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    } as jwt.SignOptions);
    
    // Log successful login
    userActionLogger.info({
      action: 'login_successful',
      userId: user._id,
      email: user.email,
      role: user.role,
      realEstateId: user.realEstateId,
      buildingId: user.buildingId,
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      responseTime: Date.now() - startTime,
      timestamp: new Date()
    });
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            realEstateId: user.realEstateId,
            buildingId: user.buildingId,
            isActive: user.isActive,
            modules: user.modules
          }
        }
      },
      { 
        status: 200,
        headers: {
          'X-Response-Time': `${Date.now() - startTime}ms`
        }
      }
    );
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    userActionLogger.error({
      action: 'login_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime,
      timestamp: new Date()
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'LOGIN_ERROR'
      },
      { 
        status: 500,
        headers: {
          'X-Response-Time': `${responseTime}ms`
        }
      }
    );
  }
}

/**
 * OPTIONS /api/auth/login
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 