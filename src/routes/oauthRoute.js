import { Router } from "express";
// import passport from "passport";
import session from "express-session";

const oauthRouter = Router();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

oauthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
oauthRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);
oauthRouter.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});
oauthRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session?.destroy(() => {
      res.clearCookie("connect.sid"); 
      res.send("Goodbye!");
    });
  });
});
oauthRouter.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

export default oauthRouter;
