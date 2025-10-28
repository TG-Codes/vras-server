const express = require('express');

// Load environment variables from .env file
require('dotenv').config();

// Create Express app
const app = express();

// Cors
const cors = require('cors');
app.use(cors());

// Body-parser Middleware
const bodyParser = require('body-parser'); /* deprecated */
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
// app.use(express.urlencoded({ extended: true }));
// Parse requests of content-type - application/json
app.use(bodyParser.json()); /* bodyParser.json() is deprecated */
// app.use(express.json());

// Cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Express-session
const session = require('express-session');
app.use(session({
    secret: 'local',
    saveUninitialized: true,
    resave: true
}));

// Express-flash
const flash = require('express-flash');
app.use(flash());

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Swagger UI with enhanced configuration
const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestSnippetsEnabled: true,
        syntaxHighlight: {
            activate: true,
            theme: 'agate'
        },
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: 'list',
        operationsSorter: 'alpha',
        tagsSorter: 'alpha',
        deepLinking: true,
        showMutatedRequest: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        validatorUrl: null,
        onComplete: function() {
            console.log('🎯 VRAS API Documentation loaded successfully!');
            console.log('📚 Access comprehensive API docs with interactive testing');
            console.log('🔐 Authentication: Use Bearer token from login endpoint');
        }
    },
    customCss: `
        .swagger-ui .topbar { 
            display: none !important; 
        }
        .swagger-ui .info .title {
            color: #2c3e50 !important;
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            margin-bottom: 1rem !important;
        }
        .swagger-ui .info .description {
            font-size: 1.1rem !important;
            line-height: 1.6 !important;
            color: #34495e !important;
            margin-bottom: 2rem !important;
        }
        .swagger-ui .scheme-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 8px !important;
            padding: 1rem !important;
            margin-bottom: 2rem !important;
        }
        .swagger-ui .btn.authorize {
            background: #27ae60 !important;
            border-color: #27ae60 !important;
            color: white !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
        }
        .swagger-ui .btn.authorize:hover {
            background: #229954 !important;
            border-color: #229954 !important;
        }
        .swagger-ui .opblock.opblock-get {
            border-color: #61affe !important;
            background: rgba(97, 175, 254, 0.1) !important;
        }
        .swagger-ui .opblock.opblock-post {
            border-color: #49cc90 !important;
            background: rgba(73, 204, 144, 0.1) !important;
        }
        .swagger-ui .opblock.opblock-put {
            border-color: #fca130 !important;
            background: rgba(252, 161, 48, 0.1) !important;
        }
        .swagger-ui .opblock.opblock-delete {
            border-color: #f93e3e !important;
            background: rgba(249, 62, 62, 0.1) !important;
        }
        .swagger-ui .opblock .opblock-summary {
            border-radius: 6px !important;
        }
        .swagger-ui .opblock .opblock-summary-description {
            font-weight: 500 !important;
            color: #2c3e50 !important;
        }
        .swagger-ui .opblock .opblock-summary-path {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-weight: 600 !important;
        }
        .swagger-ui .parameter__name {
            font-weight: 600 !important;
            color: #2c3e50 !important;
        }
        .swagger-ui .parameter__type {
            color: #7f8c8d !important;
            font-weight: 500 !important;
        }
        .swagger-ui .response-col_status {
            font-weight: 600 !important;
        }
        .swagger-ui .response-col_description__inner p {
            color: #34495e !important;
            line-height: 1.5 !important;
        }
        .swagger-ui .model-title {
            color: #2c3e50 !important;
            font-weight: 700 !important;
        }
        .swagger-ui .model .property {
            color: #34495e !important;
        }
        .swagger-ui .model .property.primitive {
            color: #8e44ad !important;
        }
        .swagger-ui .model .property.primitive .property-type {
            color: #e74c3c !important;
            font-weight: 600 !important;
        }
        .swagger-ui .btn.execute {
            background: #3498db !important;
            border-color: #3498db !important;
            color: white !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
        }
        .swagger-ui .btn.execute:hover {
            background: #2980b9 !important;
            border-color: #2980b9 !important;
        }
        .swagger-ui .btn.try-out__btn {
            background: #9b59b6 !important;
            border-color: #9b59b6 !important;
            color: white !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            padding: 6px 12px !important;
        }
        .swagger-ui .btn.try-out__btn:hover {
            background: #8e44ad !important;
            border-color: #8e44ad !important;
        }
        .swagger-ui .highlight-code {
            background: #f8f9fa !important;
            border: 1px solid #e9ecef !important;
            border-radius: 6px !important;
            padding: 1rem !important;
        }
        .swagger-ui .response .microlight {
            background: #2d3748 !important;
            color: #e2e8f0 !important;
            border-radius: 6px !important;
            padding: 1rem !important;
        }
        .swagger-ui .info .base-url {
            background: #ecf0f1 !important;
            border-radius: 6px !important;
            padding: 0.5rem 1rem !important;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-weight: 600 !important;
            color: #2c3e50 !important;
        }
        .swagger-ui .info .title:after {
            content: " 🎯";
            font-size: 2rem;
        }
        .swagger-ui .info .description:before {
            content: "🚀 ";
            font-size: 1.2rem;
        }
        .swagger-ui .info .description:after {
            content: " 🌟";
            font-size: 1.2rem;
        }
    `,
    customSiteTitle: 'VRAS API Documentation - Virtual Reality Assessment System',
    customfavIcon: '/favicon.ico',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
    ],
    customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/agate.min.css'
    ]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));

// Method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Path
const path = require('path');

// Serve Static Resources
app.use('/public', express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

// Database
const { sequelize } = require('./config/database');
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

global.blacklistedTokens = new Set();
// Relation Model Setup
require('./models/Associations');

// Homepage Route
app.get('/', (req, res) => {
    try {
        return res.redirect('/api-docs');
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Routes
const adminApiRoutes = require('./routes/admin/api');
app.use('/api/admin', adminApiRoutes); // Admin API Route

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); // API Route

app.use((req, res, next) => {
    res.render('pages/404');
}); // 404 Route

// View Engine Setup
app.set('views', 'views');
// app.set('views', path.join(__dirname, '/views/'));
// ejs View Engine
app.set('view engine', 'ejs');

// Server listen
var PORT = process.env.APP_PORT || 5000;
var HOST = process.env.APP_HOST || '0.0.0.0';
app.listen(PORT, HOST, (error) => {
    if (error) throw error;
    console.log(`Express server started at http://${HOST}:${PORT}/`);
});