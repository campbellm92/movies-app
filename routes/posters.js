const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const upload = require("../middleware/multerUpload");
require("dotenv").config({ path: "../.env" });

const OMDB_BASE = "https://www.omdbapi.com/?apikey="
const OMDB_API_KEY = process.env.OMDB_KEY;

const siteTitle = "PopcornBase";

// tt0027977
// find posters route
router.get("/", async (req, res, next) => {
  const searchTerm = req.query.q;
  const url = OMDB_BASE + OMDB_API_KEY + "&i=" + searchTerm;

  if (searchTerm === undefined) {
    return res.render("posters/posters", {
      title: siteTitle,
    });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.Response === "False") {
      return res.render("posters/posters", {
        title: siteTitle,
        error: "No movies found",
      });
    } else {
      res.render("posters/posters", {
        title: siteTitle,
        poster: data.Poster,
        searchTerm: searchTerm,
        error: " ",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//upload posters route

router.get("/add", (req, res, next) => {
  res.render("posters/add", {
    title: siteTitle,
  })
})

router.post("/add", upload.single("image"), (req, res) => {
  if(!req.file) {
    res.render("posters/add", {
      title: siteTitle,
      error: "Upload failed"
    });
  } else {
    res.render("posters/add", {
      title: siteTitle,
      message: "Image uploaded successfully."
    });
  };
});


module.exports = router;

// SRC dynamically updating pictures for posters https://stackoverflow.com/questions/12531743/handlebars-templating-and-dynamic-images