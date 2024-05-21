const express = require('express');
const cors = require('cors');
const app = express();
const requestIp = require('request-ip');
const { isCelebrateError } = require('celebrate');
const fs = require('fs');
const endMw = require('express-end');

// Routes
const mediaRouter = require('./src/routes/media.routes');
const userRouter = require('./src/routes/user.routes');
const distributionRoutes = require('./src/routes/distribution.routes');
const salesmanRoutes = require('./src/routes/salesman.routes');


const helmet = require('helmet');
const xss = require('xss-clean');
const { requestLogger, errorLogger } = require('./src/middleware/logger.middleware');

// This will create folder in root dir with provided name and if exist already nothing happen
const uploadsFolder = './uploads';
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
}

// ----------------------------------Middleware Ended-------------------------------

// Order of this route matters need to place this above store log middleware as it's returning empty result and we don't need to store record of this
app.get('/' + process.env.ROUTE + '/pingServer', (req, res) => {
    // Route to Ping & check if Server is online
    res.status(200).send('OK');
});

// ----------------------------Middleware for accepting encoded & json request params
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------------------------Middleware Ended-------------------------------

// ----------------------------Middleware for capturing request is actually ended even though listener is timed out
app.use(endMw);
// ----------------------------------Middleware Ended-------------------------------

// // ----------------------------Middleware for reading raw Body as text use req.body
app.use(
    express.text({
        type: 'text/plain',
        limit: '50mb'
    })
);
// ----------------------------------Middleware Ended-------------------------------

// ----------------------------Middleware for Getting a user's IP
app.use(requestIp.mw());
// ----------------------------------Middleware Ended-------------------------------

// ----------------------------Middleware to Fix CORS Errors This Will Update The Incoming Request before sending to routes
// Allow requests from all origins
app.use(cors());

// Configure Helmet
app.use(helmet());

// Add Helmet configurations
app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

app.use(
    helmet.referrerPolicy({
        policy: 'no-referrer'
    })
);

app.use(requestLogger); // Log all requests

// sanitize request data
// Configure xssClean middleware to whitelist all tags except <script> and allow "style" attribute
const xssOptions = {
    whiteList: {
        '*': ['style'], // Allow all tags with "style" attribute
        script: [] // Disallow <script> tags
    }
};

app.use(xss(xssOptions));

app.use('/uploads', express.static('uploads'));

// Routes which should handle requests
app.use('/' + process.env.ROUTE + '/user', userRouter);
app.use('/' + process.env.ROUTE + '/media', mediaRouter);
app.use('/' + process.env.ROUTE + '/distributions', distributionRoutes); // Distribution routes
app.use('/' + process.env.ROUTE + '/salesmen', salesmanRoutes); // Salesman routes


// ----------------------------Middleware for catching 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error(404, "Path not found");
    error.statusCode = 404;
    next(error);
});

process.on('unhandledRejection', (error) => {
    // Additional logic (like sending email notifications)
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    // Additional logic (like shutting down the server gracefully)
    process.exit(1);
});

app.use(errorLogger); // Log all errors

// Error handler
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const sendErrorResponse = (status, message, desc, stack) => {
        res.status(status).json({
            result: message,
            code: status,
            desc: desc,
            stack: process.env.NODE_ENV === 'production' ? null : stack
        });
    };

    // Celebrate validation errors
    if (error.details) {
        const errorBody = error.details.get('body');
        const {
            details: [errorDetails]
        } = errorBody;
        sendErrorResponse(422, 'Validation error', errorDetails.message, error.stack);
    } else {
        const statusCode = error.statusCode || 500;
        sendErrorResponse(statusCode, 'error', error.message || 'Internal Server Error', error.stack);
    }
});



module.exports = app;
