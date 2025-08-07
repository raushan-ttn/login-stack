import { Request, Response, Router } from "express";
const passport = require("passport");

const router = Router();

// Google Login Route
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("/api/v1/auth/google/profile");
  }
);

// Logout route
router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

// Profile route (protected)
router.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(
    `Hello, ${(req.user as any).displayName} <img src="${
      (req.user as any).photos?.[0]?.value
    }" height="100" width="100"/>`
  );
});

export default router;
