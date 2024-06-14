const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const logger = require("./config/logger");
const moviesRouter = require("./routes/movies");
const postersRouter = require("./routes/posters");
//const userRouter = require("./routes/user");
const indexRouter = require("./routes/index");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

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

// Setup routes
app.use("/", indexRouter);
app.use("/movies", moviesRouter);
app.use("/posters", postersRouter);
//app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
