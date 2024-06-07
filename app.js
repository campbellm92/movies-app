const express = require("express");
const options = require("./config/knexconfig");
const knex = require("knex")(options);
const logger = require("./config/logger");
const path = require("path");
const hbs = require("hbs");

require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);


app.use((req, res, next) => {
    req.db = knex
    next();
})


// access the routes:

const indexRouter = require("./routes/index");
// const moviesRouter = require("./routes/movies");
// const postersRouter = require("./routes/posters");
// const userRouter = require("./routes/user");

app.use("/", indexRouter);
// app.use("/movies", moviesRouter);
// app.use("/posters", postersRouter);
// app.use("/user", userRouter);


app.listen(port, () => {
    console.log("Server up on port 3000");
});