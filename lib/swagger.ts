/**
 * lib/swagger.ts
 * Swagger/OpenAPI configuration for RealEstatePro CRM
 * This file sets up API documentation with comprehensive schemas and endpoints
 */

import { createSwaggerSpec } from 'next-swagger-doc';

/**
 * Swagger configuration options
 * Defines the API documentation structure and metadata
 */
const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RealEstatePro CRM API',
      version: '1.0.0',
      description: `
        # RealEstatePro CRM - Enterprise Multi-Tenant Real Estate Management Platform
        
        ## Overview
        This API provides comprehensive real estate management functionality including:
        - Multi-tenant architecture with data isolation
        - Role-based access control (RBAC)
        - User management and authentication
        - Building and flat management
        - Tenant management
        - Payment processing
        - Maintenance requests
        - Reporting and analytics
        
        ## Authentication
        All API endpoints require JWT authentication except for login and public endpoints.
        Include the JWT token in the Authorization header: \`Bearer <token>\`
        
        ## Multi-Tenancy
        Each request is automatically scoped to the authenticated user's tenant.
        Super Admins can access all tenants, while other roles are restricted to their assigned tenant.
        
        ## Rate Limiting
        API requests are rate-limited to 100 requests per minute per IP address.
        
        ## Error Handling
        All errors follow a consistent format with appropriate HTTP status codes.
      `,
      contact: {
        name: 'RealEstatePro CRM Support',
        email: 'support@realestatepro.com',
        url: 'https://realestatepro.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.realestatepro.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for API authentication'
        }
      },
      schemas: {
        // User Schema
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'admin', 'sales', 'maintenance', 'tenant', 'receptionist'],
              description: 'User role in the system'
            },
            tenantId: {
              type: 'string',
              description: 'Associated tenant ID (null for super admin)'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'User account status'
            },
            modules: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['users', 'buildings', 'flats', 'tenants', 'payments', 'maintenance', 'reports']
              },
              description: 'Assigned modules for the user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          },
          required: ['email', 'firstName', 'lastName', 'role']
        },
        
        // Login Request Schema
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          },
          required: ['email', 'password']
        },
        
        // Login Response Schema
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Login success status'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: {
              type: 'string',
              description: 'JWT access token'
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token'
            },
            expiresIn: {
              type: 'number',
              description: 'Token expiration time in seconds'
            }
          }
        },
        
        // Error Response Schema
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code for programmatic handling'
            },
            details: {
              type: 'object',
              description: 'Additional error details'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp'
            }
          }
        },
        
        // Success Response Schema
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        },
        
        // Pagination Schema
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
              example: 1
            },
            limit: {
              type: 'integer',
              description: 'Items per page',
              example: 10
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
              example: 100
            },
            pages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 10
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management operations'
      },
      {
        name: 'System',
        description: 'System health and documentation endpoints'
      }
    ]
  },
  apiFolder: 'app/api',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
};

/**
 * Create Swagger specification
 * Generates the OpenAPI specification from the configuration
 */
export const getApiDocs = () => {
  return createSwaggerSpec(swaggerConfig);
};

/**
 * Swagger UI configuration
 * Additional options for the Swagger UI interface
 */
export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2563eb; font-size: 2.5em; }
    .swagger-ui .info .description { font-size: 1.1em; line-height: 1.6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
  `,
  customSiteTitle: 'RealEstatePro CRM API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true,
    tryItOutEnabled: true,
    requestInterceptor: (req: any) => {
      // Add default headers for testing
      req.headers['Content-Type'] = 'application/json';
      return req;
    }
  }
}; 