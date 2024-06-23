const helmet = require("helmet");

const helmetMW = helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https://m.media-amazon.com"]
      }
    }
  });

module.exports = helmetMW;