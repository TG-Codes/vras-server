const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VRAS API Documentation',
      version: '1.0.0',
      description: 'Virtual Reality Assessment System - Tactical Training Platform API',
      contact: {
        name: 'VRAS Support',
        email: 'support@vras.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Development server'
      },
      {
        url: 'https://your-vercel-domain.vercel.app/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            clientId: { type: 'integer' },
            name: { type: 'string' },
            lastName: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'client', 'instructor', 'user'] },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            mobile: { type: 'string' },
            countryCode: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female'] },
            primaryHand: { type: 'string', enum: ['left', 'right'] },
            experienceLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            stressLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['active', 'inactive', 'delete'] },
            isPro: { type: 'boolean' },
            isOnline: { type: 'boolean' }
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            mobile: { type: 'string' },
            numberOfUsers: { type: 'integer' },
            numberOfProUsers: { type: 'integer' },
            startAt: { type: 'string', format: 'date' },
            endAt: { type: 'string', format: 'date' },
            payStatus: { type: 'string', enum: ['paid', 'initiate', 'due'] },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Mission: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            scenarioId: { type: 'integer' },
            assaultTime: { type: 'string', format: 'time' },
            bulletsFired: { type: 'integer' },
            bulletsOnTerrorist: { type: 'integer' },
            bulletsOnCrowd: { type: 'integer' },
            accuracy: { type: 'number', format: 'float' },
            casualities: { type: 'integer' },
            survived: { type: 'integer' },
            confirmedKills: { type: 'integer' },
            responseTime: { type: 'string', format: 'time' },
            feedback: { type: 'string' }
          }
        },
        Scenario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            environmentId: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Environment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'mobile'],
          properties: {
            name: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            mobile: { type: 'string' },
            countryCode: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female'] },
            primaryHand: { type: 'string', enum: ['left', 'right'] }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/api.js',
    './routes/admin/api.js',
    './controllers/api/*.js',
    './controllers/admin/api/*.js'
  ]
};

const specs = swaggerJSDoc(options);
module.exports = specs;
