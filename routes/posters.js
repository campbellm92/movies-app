const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const upload = require("../middleware/multerUpload");
require("dotenv").config({ path: "../.env" });

const OMDB_BASE = "https://www.omdbapi.com/"
const OMDB_API_KEY = process.env.OMDB_KEY;


// find posters route
router.get("/", async (req, res, next) => {
  const searchTerm = req.query.q;
  const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${searchTerm}`;

  if (searchTerm === undefined) {
    return res.render("posters/posters", {
      noMoviesError: "",
      searchTerm: searchTerm
    });
  };

  if (!searchTerm || searchTerm.trim() === "") {
    return res.status(400).render("posters/posters", {
      noSearchError: "You must provide an IMDb Id!",
      noMoviesError: "",
      searchTerm: searchTerm
    })
  }

  try { // consider wiring this up to fetch the poster from the db, but also having the API as a backup
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.Response === "False") {
      return res.status(404).render("posters/posters", {
        noMoviesError: "No movies found",
      });
    } else {
      res.status(200).render("posters/posters", {
        poster: data.Poster,
        searchTerm: searchTerm,
        error: " ",
      });
    }
  } catch (err) {
    logger.log(err);
    res.status(500).render("posters/posters", {
      serverError: "An error occurred while fetching the data. Please try again."
    })
  }
});

//upload posters route

router.get("/add", (req, res, next) => {
  res.render("posters/add");
});

// this uploading to local storage, but not to the database

router.post("/add", upload.single("image"), async (req, res) => { 
  const filePath = req.file.path;
  const imdbid = req.body.imdbid;
  const file = req.file;

  if(!imdbid) {
    return res.status(400).render("posters/add", {
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
      return res.status(400).render("posters/add", {
        error: "Movie not found"
      });
    };
    
    const update = await knex("basics").where("tconst", imdbid).update({ posters: filePath });

    if(!update) { 
      res.send(400)
    } else {
      res.status(200).render("posters/add", {
        message: "Poster uploaded successfully",
        error: ""
      });
    }


  } catch (err) {
    res.status(500).render("posters/add", {
      error: "Upload failed"
    })
  }

});


module.exports = router;

