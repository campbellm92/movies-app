const rateLimit = require("express-rate-limit");

// General rate limiter:
const limiter = rateLimit({
    windowMS: 10 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Slow down there, cowboy! That's way too many requests. Please try again later."
});

// Specific limiter for registration:
const registerLimiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    limit: 5,
    message: "Too many account creation requests from this IP. Please try again later."
});

module.exports = {
    limiter,
    registerLimiter
};
