const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Define the destination path
//const destinationPath = path.join(__dirname, "../public/images/uploads");

// Create multer disk storage
const storage = multer.diskStorage({
 
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Export multer middleware with the configured storage
module.exports = multer({ storage: storage });

