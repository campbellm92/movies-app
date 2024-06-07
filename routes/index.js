const express = require("express");
const router = express.Router();
const logger = require("../config/logger");

router.get("/", (req, res) => {
    res.send("HEY!");
    logger.info("landed @ homepage");
});

router.get('/test-db', async (req, res) => {
    try {
        const data = await req.db('basics').select('*').limit(10);
        res.json(data);
    } catch (error) {
        logger.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;