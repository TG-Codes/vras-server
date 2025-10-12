/**
 * @swagger
 * tags:
 *   - name: Admin Authentication
 *     description: Admin authentication and authorization
 *   - name: Admin User Management
 *     description: Admin user management operations
 *   - name: Admin Online Tracking
 *     description: Real-time online user tracking and management
 *   - name: Admin Content Management
 *     description: Admin content and system management
 */

const express = require('express');
const group = require('express-group-routes');

// Router
var router = express.Router();

// Common Response
const { response } = require('../../config/response');

// JWT Middleware - Auth
const { authentication, roleAuthorization } = require('../../config/auth');

// Import Controllers
const { login, logout, refreshToken } = require('../../controllers/admin/api/auth/loginController');
const { forgotPassword } = require('../../controllers/admin/api/auth/password/forgotPasswordController');
const { resetPassword } = require('../../controllers/admin/api/auth/password/resetPasswordController');
const { store } = require('../../controllers/admin/api/passwordController');
const permissionsController = require('../../controllers/admin/api/permissionsController');
const settingsController = require('../../controllers/admin/api/settingsController');
const logosController = require('../../controllers/admin/api/logosController');
const videosController = require('../../controllers/admin/api/videosController');
const testimonialsController = require('../../controllers/admin/api/testimonialsController');
const cmsController = require('../../controllers/admin/api/cmsController');
const blogsController = require('../../controllers/admin/api/blogsController');
const weaponsController = require('../../controllers/admin/api/weaponsController');
const subscriptionsController = require('../../controllers/admin/api/subscriptionsController');
const environmentsController = require('../../controllers/admin/api/environmentsController');
const scenariosController = require('../../controllers/admin/api/scenariosController');
const clientsController = require('../../controllers/admin/api/clientsController');
const dasboardController = require('../../controllers/admin/api/dashboardController');
const rolesController = require('../../controllers/admin/api/roleController');
const adminController = require('../../controllers/admin/api/adminController');
const onlineUsersController = require('../../controllers/admin/api/onlineUsersController');

router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome Admin API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.delete('/logout', [authentication, roleAuthorization('admin')], logout);
router.post('/change-password', [authentication, roleAuthorization('admin')], store);

router.get('/total-pro-users', [authentication, roleAuthorization('admin')], dasboardController.totalProUser);
router.get('/total-pro-users/:id', [authentication, roleAuthorization('admin')], dasboardController.proUserDetail);

router.group('/generate-admins', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', adminController.index);
    router.post('/store', adminController.store);
    router.get('/show/:id', adminController.show);
    router.put('/update/:id', adminController.update);
    router.delete('/destroy/:id', adminController.destroy);
});

router.group('/clients', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', clientsController.index);
    router.post('/store', clientsController.store);
    router.get('/show/:id', clientsController.show);
    router.put('/update/:id', clientsController.update);
    router.delete('/destroy/:id', clientsController.destroy);
    router.post('/change-status/:id', clientsController.changeStatus);
    router.get('/:environmentId/scenarios', clientsController.getScenariosByEnvironmentId);
    router.get('/:clientId/users', clientsController.listProUsers);
    router.get('/:total-pro-users', clientsController.totalProUser);
    router.get('/:clientId/scenarios-list', clientsController.scenariosList);
    router.get('/:clientId/departments', clientsController.departmentList);
    // List departments-wise pro users of a client
    router.get('/:id/departments/:departmentId/users', clientsController.listDepartmentsProUser);
    // List pro users-wise departments of a client
    router.get('/:id/users/:userId/departments', clientsController.listProUsersDepartments);
});

router.group('/roles', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', rolesController.index);
});

router.group('/permissions', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', permissionsController.index);
    router.post('/store', permissionsController.store);
    router.get('/show/:id', permissionsController.show);
    router.put('/update/:id', permissionsController.update);
    router.delete('/destroy/:id', permissionsController.destroy);
});

router.group('/subscriptions', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', subscriptionsController.index);
    router.post('/store', subscriptionsController.store);
    router.get('/show/:id', subscriptionsController.show);
    router.put('/update/:id', subscriptionsController.update);
    router.delete('/destroy/:id', subscriptionsController.destroy);
});

router.group('/environments', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', environmentsController.index);
    router.post('/store', environmentsController.store);
    router.get('/show/:id', environmentsController.show);
    router.put('/update/:id', environmentsController.update);
    router.delete('/destroy/:id', environmentsController.destroy);
});

router.group('/scenarios', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', scenariosController.index);
    router.post('/store', scenariosController.store);
    router.get('/show/:id', scenariosController.show);
    router.put('/update/:id', scenariosController.update);
    router.delete('/destroy/:id', scenariosController.destroy);
});

router.group('/weapons', (router) => {
    // router.use([authentication, roleAuthorization('admin')]);
    router.get('/', weaponsController.index);
    router.post('/store', weaponsController.store);
    router.get('/show/:id', weaponsController.show);
    router.put('/update/:id', weaponsController.update);
    router.delete('/destroy/:id', weaponsController.destroy);
});

router.group('/settings', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', settingsController.index);
    router.post('/store', settingsController.store);
    router.get('/show/:id', settingsController.show);
    router.put('/update/:identifier', settingsController.update);
    router.put('/key-update/:key', settingsController.keyUpdate);
    router.delete('/destroy/:id', settingsController.destroy);
});

router.group('/logos', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', logosController.index);
    router.post('/store', logosController.store);
    router.get('/show/:id', logosController.show);
    router.put('/update/:id', logosController.update);
    router.delete('/destroy/:id', logosController.destroy);
});

router.group('/cms', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', cmsController.index);
    router.post('/store', cmsController.store);
    router.get('/show/:id', cmsController.show);
    router.put('/update/:id', cmsController.update);
    router.delete('/destroy/:id', cmsController.destroy);
});

router.group('/blogs', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', blogsController.index);
    router.post('/store', blogsController.store);
    router.get('/show/:id', blogsController.show);
    router.put('/update/:id', blogsController.update);
    router.delete('/destroy/:id', blogsController.destroy);
});

router.group('/testimonials', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', testimonialsController.index);
    router.post('/store', testimonialsController.store);
    router.get('/show/:id', testimonialsController.show);
    router.put('/update/:id', testimonialsController.update);
    router.delete('/destroy/:id', testimonialsController.destroy);
});

router.group('/videos', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    router.get('/', videosController.index);
    router.post('/store', videosController.store);
    router.get('/show/:id', videosController.show);
    router.put('/update/:id', videosController.update);
    router.delete('/destroy/:id', videosController.destroy);
});

// Online Users Management Routes
/**
 * @swagger
 * /admin/online-users:
 *   get:
 *     summary: Get all online users
 *     description: Retrieve list of currently online users with filtering and pagination
 *     tags: [Admin Online Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: length
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         description: Filter by client ID
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, client, instructor, user, all]
 *         description: Filter by user role
 *       - in: query
 *         name: keywords
 *         schema:
 *           type: string
 *         description: Search by name, email, or username
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, role, lastLogin]
 *           default: lastLogin
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Online users retrieved successfully
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
 *                         onlineUsers:
 *                           type: array
 *                           items:
 *                             allOf:
 *                               - $ref: '#/components/schemas/User'
 *                               - type: object
 *                                 properties:
 *                                   client:
 *                                     $ref: '#/components/schemas/Client'
 *                                   departments:
 *                                     type: array
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         id:
 *                                           type: integer
 *                                         name:
 *                                           type: string
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         length:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */

/**
 * @swagger
 * /admin/online-users/stats:
 *   get:
 *     summary: Get online users statistics
 *     description: Retrieve statistics about online users including counts by role and client
 *     tags: [Admin Online Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         description: Filter statistics by client ID
 *     responses:
 *       200:
 *         description: Online statistics retrieved successfully
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
 *                         totalOnline:
 *                           type: integer
 *                         recentlyOnline:
 *                           type: integer
 *                         byRole:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               role:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         byClient:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               clientId:
 *                                 type: integer
 *                               count:
 *                                 type: integer
 *                               client:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */

/**
 * @swagger
 * /admin/online-users/activity/{userId}:
 *   get:
 *     summary: Get user activity details
 *     description: Retrieve detailed activity information for a specific user
 *     tags: [Admin Online Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to retrieve activity for
 *     responses:
 *       200:
 *         description: User activity retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /admin/online-users/force-logout/{userId}:
 *   post:
 *     summary: Force logout a user
 *     description: Force logout a specific user (admin function)
 *     tags: [Admin Online Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to force logout
 *     responses:
 *       200:
 *         description: User force logged out successfully
 *       404:
 *         description: User not found
 */

router.group('/online-users', (router) => {
    router.use([authentication, roleAuthorization('admin')]);
    
    router.get('/', onlineUsersController.getOnlineUsers);
    router.get('/stats', onlineUsersController.getOnlineStats);
    router.get('/activity/:userId', onlineUsersController.getUserActivity);
    router.post('/force-logout/:userId', onlineUsersController.forceLogoutUser);
});

module.exports = router;