const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const logger = require("./config/logger");
const helmet = require("helmet");
const limiter = require("./middleware/rateLimiter");
const moviesRouter = require("./routes/movies");
const postersRouter = require("./routes/posters");
const userRouter = require("./routes/user");
const indexRouter = require("./routes/index");
require("dotenv").config();

// security: look into express rate limit, CORS
// CORS: https://www.npmjs.com/package/cors

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "img-src": ["self", "https://m.media-amazon.com"]
    }
  }
})); // SRC: https://blog.logrocket.com/using-helmet-node-js-secure-application/

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.db = require('knex')(require('./config/knexfile'));
  next();
});

const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(path.join(__dirname, "public")));

// Set up routes
app.use("/", indexRouter);
app.use("/movies", moviesRouter);
app.use("/posters", postersRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
