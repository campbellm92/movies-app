const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/search", async (req, res, next) => {
  const searchTerm = req.query.q; // https://www.shecodes.io/athena/72173-what-does-req-query-do-in-express-js
  try {
    const rows = await req.db("basics")
      .select("primaryTitle", "startYear", "genres")
      .where("primaryTitle", "like", `%${searchTerm}%`); // https://www.w3schools.com/sql/sql_wildcards.asp
    res.render("movies/search", {
      title: "PopcornBase",
      movies: rows,
      searchTerm: searchTerm,
    });
  } catch (err) {
    logger.error(err);
    res.render("movies/search", {
      error: "Error in query",
    });
  }
});

router.get("/data", (req, res) => {
    res.render("movies/data", {
        title: "PopcornBase"
    });
    logger.info("landed @ imdb id search page")
});

module.exports = router;


// res.render("movies/search", {
//     title: "PopcornBase"
// });
// logger.info("landed @ movies search page")