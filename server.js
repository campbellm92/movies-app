const fs = require("fs");
const http = require("http");
const https = require("https");
const app = require("./app");
const logger = require("./config/logger");
require("dotenv").config();

const port = process.env.PORT || 3000;

const key = process.env.SSL_KEY_PATH;
const cert = process.env.SSL_CERT_PATH;

if (key && cert) {
    const credentials = {
        key: fs.readFileSync(key, "utf8"),
        cert: fs.readFileSync(cert, "utf8")
    };
    https.createServer(credentials, app).listen(port, () => {
        logger.info(`Server running on https://localhost:${port}`);
    });
} else {
    http.createServer(app).listen(port, () => {
        logger.info(`Server running on http://localhost:${port}`);
    });
};


