const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const helmetMW = require("./middleware/helmet");
const { limiter } = require("./middleware/rateLimiter");
const moviesRouter = require("./routes/movies");
const postersRouter = require("./routes/posters");
const userRouter = require("./routes/user");
const indexRouter = require("./routes/index");
require("dotenv").config();

const app = express();

app.use(helmetMW); 

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

module.exports = app;