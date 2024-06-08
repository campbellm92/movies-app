const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/", (req, res) => {
    res.render("index", {
        title: "PopcornBase"
    });
    logger.info("landed @ homepage");
});



module.exports = router;