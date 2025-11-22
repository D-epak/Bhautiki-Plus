import rateLimit from "express-rate-limit";

// Global / per-route limiter example
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: "Too many requests, please try again later." },
});
