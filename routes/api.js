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

router.get('/', (req, res) => {
    try {
        return response(res, req.body, 'Welcome API', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
});

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/vrlogin', vrLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
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

// Clients Section //
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