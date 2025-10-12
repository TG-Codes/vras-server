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