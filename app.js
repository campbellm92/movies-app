const express = require("express");
const knex = require("knex") // (options) needed?
const logger = require("./config/logger");
const path = require("path");

require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

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