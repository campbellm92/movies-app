const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const OMDB_BASE = "https://www.omdbapi.com/?apikey="
const OMDB_API_KEY = process.env.OMDB_KEY;

async function getOMDBTitleInfo(searchTerm) {
    try {
        const response = await fetch(`${OMDB_BASE}${OMDB_API_KEY}&t=${searchTerm}`);
        const data = await response.json();
    
        if (data.Response === "False") {
            return null;
        };
        return data;
    } catch (error) {
        throw new Error(`OMDb Error: ${error.message}`);
    };

};

async function getOMDBimdbIDInfo(searchTerm) {
    try {
        const response = await fetch(`${OMDB_BASE}${OMDB_API_KEY}&i=${searchTerm}`);
        const data = await response.json();
    
        if (data.Response === "False") {
            return null;
        };
        return data;
    } catch (error) {
        throw new Error(`OMDb Error: ${error.message}`);
    };

};

module.exports = { 
    getOMDBTitleInfo,
    getOMDBimdbIDInfo
};
