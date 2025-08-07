import { Request, Response, Router } from 'express';
import passport from 'passport';
import pool from '../utils/db'; // Adjust the import path as necessary
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import '../config/passport-setup'; // Ensure passport is configured

dotenv.config();
const router = Router();

// Google Login Route
router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google OAuth callback route
router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login/failed' }),
  async (req: Request, res: Response) => {
    const user = req.user as { id: number; email: string; name: string };

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET || 'default_jwt_secret',
        { expiresIn: '1h' },
      );

      await pool.query('INSERT INTO sessions(user_id, token) VALUES ($1, $2)', [
        user.id,
        token,
      ]);

      // Redirect back to React app with token as query parameter
      res.redirect(`${process.env.FE_BASE_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error('Error generating token or saving session:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// Logout route
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

// Login failed route
router.get('/login/failed', (req: Request, res: Response) => {
  res.status(401).json({ message: 'Login failed' });
});

export default router;
