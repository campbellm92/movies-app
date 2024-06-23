const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMS: 10 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Slow down there, cowboy! That's way too many requests. Please try again later."
});

module.exports = limiter;