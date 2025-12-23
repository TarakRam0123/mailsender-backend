const multer = require("multer");

const storage = multer.memoryStorage(); // use memory storage for uploading to S3
const upload = multer({ storage });

export default upload;
