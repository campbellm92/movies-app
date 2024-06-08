const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/", (req, res) => {
    res.render("posters/posters", {
        title: "PopcornBase"
    });
    logger.info("landed @ poster search page");
});



module.exports = router;