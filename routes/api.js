/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization
 *   - name: User Management
 *     description: User profile and management operations
 *   - name: Client Management
 *     description: Client organization and user management
 *   - name: VR Training
 *     description: Virtual reality training scenarios and sessions
 *   - name: Analytics
 *     description: Performance analytics and reporting
 *   - name: Content Management
 *     description: CMS, blogs, videos, and other content
 */

const express = require('express');
const group = require('express-group-routes');

// Router
var router = express.Router();

// Common Response
const { response } = require('../config/response');

// JWT Middleware - Auth
const { authentication, roleAuthorization } = require('../config/auth');

// Import Controllers
const { sendEmail, subscribe } = require('../controllers/api/contactController');
const { register } = require('../controllers/api/auth/registerController');
const { login, refreshToken, logout, vrLogin } = require('../controllers/api/auth/loginController');
const { forgotPassword } = require('../controllers/api/auth/password/forgotPasswordController');
const { resetPassword } = require('../controllers/api/auth/password/resetPasswordController');
const { store } = require('../controllers/api/passwordController');
const { show, update } = require('../controllers/api/profileController');
const settingsController = require('../controllers/api/settingsController');
const logosController = require('../controllers/api/logosController');
const videosController = require('../controllers/api/videosController');
const testimonialsController = require('../controllers/api/testimonialsController');
const cmsController = require('../controllers/api/cmsController');
const blogsController = require('../controllers/api/blogsController');
const subscriptionsController = require('../controllers/api/subscriptionsController');
const permissionsController = require('../controllers/api/permissionsController');
const scenariosController = require('../controllers/api/scenarioController');
const departmentsController = require('../controllers/api/clients/departmentsController');
const proUsersController = require('../controllers/api/clients/proUsersController');
const clientsDashboardController = require('../controllers/api/clients/dashboardController');
const missionsController = require('../controllers/api/clients/missionsController');
const warehouseController = require('../controllers/api/clients/warehouseController');
const environmentController = require('../controllers/api/environmentController');
const liveSessionsController = require('../controllers/api/clients/liveSessionsController');
const instructorDashboardController = require('../controllers/api/instructors/dashboardController');
const userDashboardController = require('../controllers/api/users/dashboardController');
const userMissionController = require('../controllers/api/clients/userMissionsController');

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Home - Redirects to Documentation
 *     description: Redirects to the Swagger API documentation
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to API documentation
 */

router.get('/', (req, res) => {
    try {
        // Redirect to the API documentation
        return res.redirect('/api-docs');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account in the VRAS system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         token:
 *                           type: string
 *       422:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);
/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     description: Generate a new access token using refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /vrlogin:
 *   post:
 *     summary: VR Device Login
 *     description: Special login for VR devices using code or username
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential:
 *                 type: string
 *                 description: User code or username for VR login
 *     responses:
 *       200:
 *         description: VR login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       422:
 *         description: Invalid credential or subscription expired
 */
router.post('/vrlogin', vrLogin);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send password reset email to user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent successfully
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset user password using reset token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: User logout
 *     description: Logout user and invalidate token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.delete('/logout', [authentication], logout);
router.post('/change-password', [authentication], store);
router.get('/site-settings/:key', settingsController.show);
router.get('/logos', logosController.index);
router.get('/videos', videosController.index);
router.get('/testimonials', testimonialsController.index);
router.get('/cms/:slug', cmsController.show);
router.get('/subscriptions', subscriptionsController.index);
router.post('/contact-mail', sendEmail);
router.post('/newsletter-subscribe', subscribe);
router.get('/profile', [authentication], show);
router.post('/profile', [authentication], update);
router.post('/permissions', [authentication], permissionsController.index);
router.get('/environments', environmentController.index);
router.get('/scenarios', scenariosController.index);
router.group('/blogs', (router) => {
    router.get('/', blogsController.index);
    router.get('/show/:slug', blogsController.show);
});

/**
 * @swagger
 * /scenarios:
 *   get:
 *     summary: Get available training scenarios
 *     description: Retrieve list of all VR training scenarios
 *     tags: [VR Training]
 *     responses:
 *       200:
 *         description: Scenarios retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         scenarios:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Scenario'
 */

/**
 * @swagger
 * /environments:
 *   get:
 *     summary: Get VR training environments
 *     description: Retrieve list of available VR training environments
 *     tags: [VR Training]
 *     responses:
 *       200:
 *         description: Environments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         environments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Environment'
 */

// VR Training Routes
router.get('/scenarios', scenariosController.index);
router.get('/environments', environmentController.index);

// Clients Section //
/**
 * @swagger
 * /clients/dashboard:
 *   get:
 *     summary: Get client dashboard data
 *     description: Retrieve dashboard analytics and overview for client
 *     tags: [Client Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /clients/pro-users:
 *   get:
 *     summary: Get pro users list
 *     description: Retrieve list of pro users for the client
 *     tags: [Client Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pro users retrieved successfully
 *   post:
 *     summary: Create new pro user
 *     description: Add a new pro user to the client organization
 *     tags: [Client Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Pro user created successfully
 */

/**
 * @swagger
 * /clients/live-sessions:
 *   get:
 *     summary: Get active live sessions
 *     description: Retrieve list of currently active VR training sessions
 *     tags: [VR Training]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Live sessions retrieved successfully
 *   post:
 *     summary: Start new live session
 *     description: Create and start a new VR training session
 *     tags: [VR Training]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, scenarioId]
 *             properties:
 *               userId:
 *                 type: integer
 *               scenarioId:
 *                 type: integer
 *               environmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Live session started successfully
 */

/**
 * @swagger
 * /clients/user-missions:
 *   get:
 *     summary: Get user mission results
 *     description: Retrieve training mission results and analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mission results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Mission'
 */

router.group('/clients', (router) => {
    router.use([authentication]);

    // // Client profile routes
    // router.get('/show', clientsController.show);
    // router.put('/update', clientsController.update);

    // Dashboard routes
    router.get('/users', clientsDashboardController.index);

    // Departments routes
    router.group('/departments', (router) => {
        router.get('/', departmentsController.index);
        router.post('/store', departmentsController.store);
        router.get('/show/:id', departmentsController.show);
        router.put('/update/:id', departmentsController.update);
        router.delete('/destroy/:id', departmentsController.destroy);
        // Pro users routes
        router.get('/pro-users', departmentsController.departmentsProUser);
        router.get('/pro-users/:departmentId', departmentsController.departmentsProUserShow);
        router.get('/:userId/pro-users', departmentsController.proUsersDepartments);
    });

    // Missions routes
    router.group('/missions', (router) => {
        router.get('/client-details', missionsController.getClientDetails)
        router.get('/', missionsController.index);
        router.post('/store', missionsController.store);
        router.get('/show/:id', missionsController.show);
        router.put('/update/:id', missionsController.update);
        router.delete('/destroy/:id', missionsController.destroy);
    });

    // Users Missions
    router.group('/users-missions', (router) => {
        router.post('/store', userMissionController.store);
        router.get('/show/:id', userMissionController.show);
    });

    // Pro users routes
    router.group('/pro-users', (router) => {
        router.get('/', proUsersController.index);
        router.post('/store', proUsersController.store);
        router.get('/show/:id', proUsersController.show);
        router.put('/update/:id', proUsersController.update);
        router.delete('/destroy/:id', proUsersController.destroy);
    });

    // Live Sessions routes
    router.group('/live-sessions', (router) => {
        router.get('/scenarios', liveSessionsController.scenariosList);
        router.get('/', liveSessionsController.index);
        router.post('/store', liveSessionsController.store);
        router.get('/show/:id', liveSessionsController.show);
        router.put('/update/:id', liveSessionsController.update);
        router.delete('/destroy/:id', liveSessionsController.destroy);
    });

    // Warehouse routes
    router.group('/warehouse', (router) => {
        router.get('/', warehouseController.index);
    });
});

// instructors section //
router.group('/instructors', (router) => {
    router.use([authentication]);
    router.get('/pro-users', instructorDashboardController.proUsersList);
    router.get('/missions', instructorDashboardController.missionsList);
    router.get('/missions/:id', instructorDashboardController.missionsDetails);
    router.get('/live-sessions', instructorDashboardController.liveSessionsList);
    router.get('/live-sessions/:id', instructorDashboardController.liveSessionDetails);
});

// Pro users & users section //
router.group('/users', (router) => {
    router.use([authentication]);
    router.get('/', userDashboardController.proUsersList);
    router.get('/missions', userDashboardController.missionsList);
    router.get('/missions/:id', userDashboardController.missionsDetails);
    router.get('/live-sessions', userDashboardController.liveSessionsList);
    router.get('/analytics-data', userDashboardController.analyticsData);
});

module.exports = router;