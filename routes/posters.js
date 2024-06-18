const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const upload = require("../middleware/multerUpload");
const getDBimdbIDInfo = require("../utils/dbFuncs/getDBinfo");
require("dotenv").config({ path: "../.env" });

const OMDB_BASE = "https://www.omdbapi.com/?apikey="
const OMDB_API_KEY = process.env.OMDB_KEY;


// tt0027977
// find posters route
router.get("/", async (req, res, next) => {
  const searchTerm = req.query.q;
  const url = OMDB_BASE + OMDB_API_KEY + "&i=" + searchTerm;

  if (searchTerm === undefined) {
    return res.render("posters/posters");
  };

  try { // consider wiring it up to fetch the poster from the db, but also having the API as a backup
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.Response === "False") {
      return res.render("posters/posters", {
        error: "No movies found",
      });
    } else {
      res.render("posters/posters", {
        poster: data.Poster,
        searchTerm: searchTerm,
        error: " ",
      });
    }
  } catch (err) {
    logger.log(err);
  }
});

//upload posters route

router.get("/add", (req, res, next) => {
  res.render("posters/add");
});

router.post("/add", upload.single("image"), async (req, res) => { // image uploading to local storage but can't get path to DB
  const filePath = req.file.path;
  const imdbid = req.body.imdbid;
  const file = req.file;

  if(!imdbid) {
    return res.render("posters/add", {
      error: "You must provide an IMDb ID!"
    })
  };

  if(!file) {
    return res.render("posters/add", {
      error: "No file has been selected"
    })
  };

  try {
    const movie = await knex("basics").where("tconst", imdbid).first();

    if (!movie) {
      return res.render("posters/add", {
        error: "Movie not found"
      });
    };
    const update = await knex("basics").where("tconst", imdbid).update({ posters: filePath });

    res.render("posters/add", {
      message: "Poster uploaded successfully",
      error: ""
    });
  } catch (err) {
    res.render("posters/add", {
      error: "Upload failed"
    })
  }

});


module.exports = router;

// SRC dynamically updating pictures for posters https://stackoverflow.com/questions/12531743/handlebars-templating-and-dynamic-images



  // if(!req.file) {
  //   res.render("posters/add", {
  //     error: "Upload failed"
  //   });
  // } else {
  //   res.render("posters/add", {
  //     message: "Image uploaded successfully."
  //   });
  // };