const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const { getDBTitleInfo, getDBimdbIDInfo }  = require("../utils/dbFuncs/getDBinfo");
const { getOMDBTitleInfo, getOMDBimdbIDInfo } = require("../utils/omdbFuncs/getOMDBinfo");

// Router for the movies/search endpoint:

router.get("/search", async (req, res, next) => {
  const searchTerm = req.query.q;

  if (searchTerm === undefined) {
    return res.render("movies/search", {
      noTitleError: "",
      notFoundError: "",
      error: "",
      combinedInfo: [],
      searchTerm: "",
    });
  };
  
  if (!searchTerm || searchTerm.trim() === "") { 
    return res.status(400).render("movies/search", {
      noTitleError: "You must provide a title!",
      notFoundError: "",
      error: "",
      combinedInfo: [],
      searchTerm: "",
    });
  
  };

  try {
    const dbInfo = await getDBTitleInfo(req.db, searchTerm);
    const omdbInfo = await getOMDBTitleInfo(searchTerm);

    if (dbInfo.length === 0 && (!omdbInfo || omdbInfo.Response === "False")) {
      return res.status(404).render("movies/search", {
        notFoundError: "Movie not found. Please try a different title.",
        noTitleError: "",
        error: "",
        combinedInfo: [],
        searchTerm,
      });
    };

    const combinedInfo = dbInfo.map(e => ({
      ...e,
      type: omdbInfo.Type,
    }));

    res.status(200).render("movies/search", {
      combinedInfo: combinedInfo,
      searchTerm: searchTerm,
      noTitleError: "",
      notFoundError: "",
      error: "",
    });

  } catch (err) {
    logger.error(err);
    res.status(500).render("movies/search", {
      catchError: "An error occurred while fetching the data. Please try again.",
    });
  };
});




// Router for the movies/data endpoint:

router.get("/data", async (req, res, next) => {
  const searchTerm = req.query.q;

  if (searchTerm === undefined) {
    return res.render("movies/data", {
      noIdError: "",
      notFoundError: "",
      error: "",
      combinedInfo: [],
      searchTerm: "",
    });
  };
  
  if (!searchTerm || searchTerm.trim() === "") { 
    return res.status(400).render("movies/data", {
      noIdError: "You must provide an IMDb Id!",
      notFoundError: "",
      error: "",
      combinedInfo: [],
      searchTerm: "",
    });
  };

  try {
    const dbInfo = await getDBimdbIDInfo(req.db, searchTerm);
    const omdbInfo = await getOMDBimdbIDInfo(searchTerm);

    if (dbInfo.length === 0 || (!omdbInfo || omdbInfo.Response === "False")) {
      return res.status(404).render("movies/data", {
        notFoundError: "Movie not found. Please try a different IMDb ID.",
        noIdError: "",
        error: "",
        combinedInfo: [],
        searchTerm,
      });
    };

    const combinedInfo = [];

    if (omdbInfo && omdbInfo.imdbID) {
      for (let i = 0; i < dbInfo.length; i++) {
        if (dbInfo[i].tconst === omdbInfo.imdbID) {
          const combined = {
            ...dbInfo[i],
            runtime: omdbInfo.Runtime,
            director: omdbInfo.Director,
            writer: omdbInfo.Writer,
            actors: omdbInfo.Actors,
            ratings: omdbInfo.Ratings.map(info => ({
              source: info.Source,
              value: info.Value
            })),
          };
          combinedInfo.push(combined);
        }
      };
    };

    res.status(200).render("movies/data", {
      combinedInfo: combinedInfo,
      searchTerm: searchTerm,
      noIdError: "",
      notFoundError: "",
      error: "",
    });

  } catch (err) {
    logger.error(err);
    res.status(200).render("movies/data", {
      catchError: "An error occurred while fetching the data. Please try again.",
    });
  };
});



module.exports = router;


