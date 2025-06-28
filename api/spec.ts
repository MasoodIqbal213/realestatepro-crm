import { NextApiRequest, NextApiResponse } from 'next';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RealEstatePro CRM API',
      version: '0.1.0',
      description: 'Next-generation multi-tenant real estate management platform API',
      contact: {
        name: 'RealEstatePro Support',
        email: 'support@realestatepro.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://uat.realestatepro.com/api',
        description: 'UAT server',
      },
      {
        url: 'https://app.realestatepro.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            code: {
              type: 'string',
              description: 'Error code',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'building_admin', 'receptionist', 'sales', 'maintenance', 'tenant'],
              description: 'User role',
            },
            tenantId: {
              type: 'string',
              description: 'Associated tenant ID',
            },
            isActive: {
              type: 'boolean',
              description: 'User active status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update date',
            },
          },
        },
        Building: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Building ID',
            },
            name: {
              type: 'string',
              description: 'Building name',
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            totalFloors: {
              type: 'integer',
              description: 'Total number of floors',
            },
            totalUnits: {
              type: 'integer',
              description: 'Total number of units',
            },
            amenities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Building amenities',
            },
            tenantId: {
              type: 'string',
              description: 'Associated tenant ID',
            },
            isActive: {
              type: 'boolean',
              description: 'Building active status',
            },
          },
        },
        Unit: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unit ID',
            },
            buildingId: {
              type: 'string',
              description: 'Associated building ID',
            },
            unitNumber: {
              type: 'string',
              description: 'Unit number',
            },
            floor: {
              type: 'integer',
              description: 'Floor number',
            },
            type: {
              type: 'string',
              enum: ['studio', '1br', '2br', '3br', 'penthouse'],
              description: 'Unit type',
            },
            area: {
              type: 'number',
              description: 'Unit area in sq ft',
            },
            rent: {
              type: 'number',
              description: 'Monthly rent amount',
            },
            status: {
              type: 'string',
              enum: ['available', 'occupied', 'maintenance', 'reserved'],
              description: 'Unit status',
            },
            tenantId: {
              type: 'string',
              description: 'Current tenant ID',
            },
          },
        },
        Tenant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Tenant ID',
            },
            firstName: {
              type: 'string',
              description: 'Tenant first name',
            },
            lastName: {
              type: 'string',
              description: 'Tenant last name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Tenant email',
            },
            phone: {
              type: 'string',
              description: 'Tenant phone number',
            },
            idNumber: {
              type: 'string',
              description: 'Government ID number',
            },
            idType: {
              type: 'string',
              enum: ['passport', 'emirates_id', 'visa'],
              description: 'ID type',
            },
            unitId: {
              type: 'string',
              description: 'Assigned unit ID',
            },
            contractStartDate: {
              type: 'string',
              format: 'date',
              description: 'Contract start date',
            },
            contractEndDate: {
              type: 'string',
              format: 'date',
              description: 'Contract end date',
            },
            monthlyRent: {
              type: 'number',
              description: 'Monthly rent amount',
            },
            securityDeposit: {
              type: 'number',
              description: 'Security deposit amount',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
              description: 'Tenant status',
            },
          },
        },
        MaintenanceRequest: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Maintenance request ID',
            },
            tenantId: {
              type: 'string',
              description: 'Requesting tenant ID',
            },
            unitId: {
              type: 'string',
              description: 'Unit ID',
            },
            category: {
              type: 'string',
              enum: ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other'],
              description: 'Maintenance category',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Request priority',
            },
            title: {
              type: 'string',
              description: 'Request title',
            },
            description: {
              type: 'string',
              description: 'Request description',
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'in_progress', 'completed', 'cancelled'],
              description: 'Request status',
            },
            assignedTo: {
              type: 'string',
              description: 'Assigned maintenance staff ID',
            },
            estimatedCompletion: {
              type: 'string',
              format: 'date-time',
              description: 'Estimated completion date',
            },
            actualCompletion: {
              type: 'string',
              format: 'date-time',
              description: 'Actual completion date',
            },
            attachments: {
              type: 'array',
              items: { type: 'string' },
              description: 'File attachments',
            },
          },
        },
        Lead: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Lead ID',
            },
            firstName: {
              type: 'string',
              description: 'Lead first name',
            },
            lastName: {
              type: 'string',
              description: 'Lead last name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Lead email',
            },
            phone: {
              type: 'string',
              description: 'Lead phone number',
            },
            source: {
              type: 'string',
              enum: ['walk_in', 'website', 'referral', 'social_media', 'other'],
              description: 'Lead source',
            },
            preferredUnitType: {
              type: 'string',
              enum: ['studio', '1br', '2br', '3br', 'penthouse'],
              description: 'Preferred unit type',
            },
            budget: {
              type: 'number',
              description: 'Budget range',
            },
            moveInDate: {
              type: 'string',
              format: 'date',
              description: 'Preferred move-in date',
            },
            status: {
              type: 'string',
              enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
              description: 'Lead status',
            },
            assignedTo: {
              type: 'string',
              description: 'Assigned sales person ID',
            },
            notes: {
              type: 'string',
              description: 'Sales notes',
            },
          },
        },
      },
    },
  },
  apis: ['./pages/api/**/*.ts', './app/api/**/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(specs);
} 