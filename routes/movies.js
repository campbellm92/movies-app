const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/search", (req, res) => {
    res.render("movies/search", {
        title: "PopcornBase"
    });
    logger.info("landed @ movies search page")
});

router.get("/data", (req, res) => {
    res.render("movies/data", {
        title: "PopcornBase"
    });
    logger.info("landed @ imdb id search page")
});

module.exports = router;