/**
 * middleware/adminAuth.js — Admin Token Guard
 *
 * Reads the X-Admin-Token header from every incoming request and
 * compares it against ADMIN_SECRET_TOKEN in your .env file.
 *
 * ✅  Token matches  → calls next(), request proceeds
 * ❌  Token missing or wrong → responds 401 immediately, nothing leaks
 *
 * Usage:  router.post("/", adminAuth, jobController.createJob);
 */

const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"];

  /* Fail fast if the env variable was never set — safety net */
  if (!process.env.ADMIN_SECRET_TOKEN) {
    console.error("[SECURITY] ADMIN_SECRET_TOKEN is not defined in .env");
    return res.status(500).json({ error: "Server misconfiguration." });
  }

  /* Block any request that doesn't supply the exact token */
  if (!token || token !== process.env.ADMIN_SECRET_TOKEN) {
    console.warn(
      `[SECURITY] Unauthorised admin attempt from ${req.ip} at ${new Date().toISOString()}`
    );
    return res.status(401).json({ error: "Unauthorised. Invalid or missing admin token." });
  }

  /* Token is valid — allow through */
  next();
};

module.exports = adminAuth;
