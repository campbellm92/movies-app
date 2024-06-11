const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
require("dotenv").config({ path: "../.env" });

const OMDB_BASE = "https://www.omdbapi.com/?apikey="
const OMDB_API_KEY = process.env.OMDB_KEY;

// tt0027977

router.get("/", async (req, res, next) => {
  const searchTerm = req.query.q;
  const url = OMDB_BASE + OMDB_API_KEY + "&i=" + searchTerm;

  if (searchTerm === undefined) {
    return res.render("posters/posters", {
      title: "PopcornBase",
    });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.Response === "False") {
      return res.render("posters/posters", {
        title: "PopcornBase",
        error: "No movies found",
      });
    } else {
      res.render("posters/posters", {
        title: "PopcornBase",
        poster: data.Poster,
        searchTerm: searchTerm,
        error: " ",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

// SRC dynamically updating pictures for posters https://stackoverflow.com/questions/12531743/handlebars-templating-and-dynamic-images