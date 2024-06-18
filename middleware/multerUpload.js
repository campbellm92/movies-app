const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, uniqueIdentifier + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;