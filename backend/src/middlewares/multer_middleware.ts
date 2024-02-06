import multer from "multer";
 
// Configure multer disk storage
const storage = multer.diskStorage({
  // Set the destination folder for storing uploaded files
  destination: function (req, file, cb) {
    return cb(null, "./public/temp");
  },
  // Set the filename for storing uploaded files
  filename: function (req, file, cb) {
    return  cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create a multer instance with the configured storage
export const upload = multer({ storage: storage });

