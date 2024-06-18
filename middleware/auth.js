const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: (__dirname, "../.env") });

const JWT_SECRET = process.env.JWT_SECRET;


function authenticateJWT (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!authHeader) {
        return res.status(401).json({ error: true, message: "Authorization header not found"});
    };

    if (!token) {
        return res.status(401).json({ error: true, message: "Token not provided"})
    };

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: true, message: "JWT token has expired "});
        } else {
            res.status(401).json({ error: true, message: "Invalid JWT token" });
        };
    };
};

function generateAccessToken(email) {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: "3600s" });
}

module.exports = {
    authenticateJWT,
    generateAccessToken
};