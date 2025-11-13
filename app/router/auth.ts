import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controller/AuthController';
import { validateRegisterApp } from '../middleware/validation';

const Authrouter = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth flow
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth page
 */
Authrouter.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 */
Authrouter.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/failure',
    session: false 
  }),
  authController.handleGoogleCallback
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new app and generate API key
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - websiteUrl
 *               - userEmail
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Awesome App"
 *               websiteUrl:
 *                 type: string
 *                 example: "https://myapp.com"
 *               userEmail:
 *                 type: string
 *                 example: "developer@myapp.com"
 *     responses:
 *       201:
 *         description: App registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 appId:
 *                   type: string
 *                 apiKey:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                 message:
 *                   type: string
 */
Authrouter.post('/register', validateRegisterApp, authController.registerApp);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     summary: Get API keys for a registered app
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: appId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API keys retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 apiKeys:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
Authrouter.get('/api-key', authController.getApiKey);

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     summary: Revoke an API key
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyId
 *               - userId
 *             properties:
 *               keyId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key revoked successfully
 */
Authrouter.post('/revoke', authController.revokeApiKey);

/**
 * @swagger
 * /api/auth/success:
 *   get:
 *     summary: OAuth success endpoint
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Authentication successful
 */
Authrouter.get('/success', (req, res) => {
  res.json({ success: true, message: 'Authentication successful' });
});

/**
 * @swagger
 * /api/auth/failure:
 *   get:
 *     summary: OAuth failure endpoint
 *     tags: [Authentication]
 *     responses:
 *       401:
 *         description: Authentication failed
 */
Authrouter.get('/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'Authentication failed' });
});

export {Authrouter};