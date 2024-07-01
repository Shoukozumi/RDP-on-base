const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/mongodb');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

async function main() {
    // Connect to MongoDB database
    await connectDB(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD);

    // Enable cors for all routes
    const corsOptions = {
        origin: 'http://rdp.refract.network',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        optionsSuccessStatus: 204
    };
    app.use(cors());  // TODO: app.use(cors(corsOptions)); change for production

    // JSON middleware
    app.use(express.json());


    // Apply authMiddleware globally for all routes except for /auth router
    const {auth_middleware} = require('./middleware/jwt_auth')
    app.use((req, res, next) => {
        if (req.path === '/' || req.path.startsWith('/auth') || req.path.startsWith('/shopify')) {
            return next();
        }
        return auth_middleware(req, res, next);
    });


    // Routes for RDPF
    app.use('/auth', require('./routes/auth_router'));
    app.use('/user', require('./routes/user_router'));
    app.use('/projects', require('./routes/projects_router'));
    app.use('/actions', require('./routes/actions_router'));
    app.use('/shopify', require('./routes/shopify_router'));

    // Routes for Refractor
    app.use('/refractor', require('./routes/refractor_router'))

    app.listen(PORT, () => {
            console.log("Server is Successfully Running, and App is listening on port "+ PORT);
        }
    );  // TODO: add support for HTTPS for security sake
}

main();