import express, { Application } from 'express';
import googleRouter from './routes/googleAuth';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { BACKEND_CONFIG } from './utils/constant';
import { setupSwagger } from './swagger';

import path from 'path';

const app: Application = express();
// Setup Swagger
setupSwagger(app);

// Constants
const apiPrefix = BACKEND_CONFIG.GLOBAL.API_PREFIX;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  }),
);

app.use(passport.initialize());
app.use(passport.session()); // Incase of JWT-Based Authentication this is not required.

// Routes
app.use(`${apiPrefix}/auth/google`, googleRouter);

export default app;
