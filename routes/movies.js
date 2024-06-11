const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/search", async (req, res, next) => {
  const searchTerm = req.query.q; // https://www.shecodes.io/athena/72173-what-does-req-query-do-in-express-js
  
  if (searchTerm === undefined) {
    return res.render("movies/search", {
      title: "PopcornBase",
    });
  };
  
  try {
    const rows = await req
      .db("basics")
      .select("primaryTitle", "startYear", "genres")
      .where("primaryTitle", "like", `%${searchTerm}%`); // https://www.w3schools.com/sql/sql_wildcards.asp

    if (!searchTerm) {
      res.render("movies/search", {
        title: "PopcornBase",
        error: "You must provide a title!",
      });
    } else if (rows.length === 0) {
      res.render("movies/search", {
        title: "PopcornBase",
        error: "Movie not found. Please try a different search term.",
      });
    } else {
      res.render("movies/search", {
        title: "PopcornBase",
        movies: rows,
        searchTerm: searchTerm,
        error: " ",
      });
    };

  } catch (err) {
    logger.error(err);
    res.render("movies/search", {
      error: "Error in database query",
    });
  }
});

// handlebars if statements: https://www.sitepoint.com/a-beginners-guide-to-handlebars/

router.get("/data", async (req, res, next) => {
  const searchTerm = req.query.q;

  if (searchTerm === undefined) {
    return res.render("movies/data", {
      title: "PopcornBase",
    });
  }; 

  try {
    const rows = await req
      .db("basics")
      .select("primaryTitle", "startYear", "genres")
      .where("tconst", "like", `%${searchTerm}%`);

    if (!searchTerm) {
      res.render("movies/data", {
        title: "PopcornBase",
        error: "You must provide an imdb ID number!",
      });
    } else if (rows.length === 0) {
      res.render("movies/data", {
        title: "PopcornBase",
        error: "Movie not found. Please try a different search term.",
      });
    } else {
      res.render("movies/data", {
        title: "PopcornBase",
        movies: rows,
        searchTerm: searchTerm,
        error: " ",
      });
    };

  } catch (err) {
    logger.error(err);
    res.render("movies/data", {
      title: "PopcornBase",
      error: "Error in database query."
    });
  }
});

module.exports = router;

// res.render("movies/search", {
//     title: "PopcornBase"
// });
// logger.info("landed @ movies search page")
