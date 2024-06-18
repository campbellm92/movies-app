const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/", (req, res) => {
    res.render("index", {
        title: "PopcornBase"
    });
});



module.exports = router;