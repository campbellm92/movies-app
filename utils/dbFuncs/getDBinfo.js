async function getDBTitleInfo(db, searchTerm) {
    try {
        return db("basics")
        .select("primaryTitle", "startYear", "tconst")
        .where("primaryTitle", "like", `%${searchTerm}%`);
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }; 
};



async function getDBimdbIDInfo(db, searchTerm) {
    try {
        return db("basics")
        .select("primaryTitle", "startYear", "tconst", "genres")
        .where("tconst", "like", `%${searchTerm}%`);
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    }; 
};

module.exports = {
    getDBTitleInfo,
    getDBimdbIDInfo
};
