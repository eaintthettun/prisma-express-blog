const multer = require('multer');
const path=require('path');

// Set up storage for profile pictures and other images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // make sure this folder exists 
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9); //generate a unique number
      const ext = path.extname(file.originalname); //extracts file extension .jpeg,.png
      cb(null, uniqueName + ext); 
    },
  });
  
const upload = multer({ storage: storage }); //this creates an upload middleware that you use in your routes

module.exports=upload;