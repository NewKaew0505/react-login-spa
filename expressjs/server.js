const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const db = require("./model");
const user = db.user;
const router = require("express").Router();
const controller = require("./controllers/user.controller");
const authMiddleware = require("./middleware");
const bodyParser = require('body-parser');
const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  },
})
const maxsize = 5000000
const upload = multer({ 
  storage: storage,
 
  fileFilter: (req, file, callback) => {
    const acceptableExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];
    if (!(acceptableExtensions.includes(path.extname(file.originalname)))) {
      return callback("File not .jpg, .jpeg, .png, .bmp'", false);
    }

    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > maxsize) {
      return callback('File too large',false);
    }

    callback(null, true);
  }
  })

class server {
  async init() {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/uploads', express.static('uploads'))

    db.sequelize.sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });


    app.post("/register", upload.single('img'), controller.create);
    app.post("/login", controller.auth);
    app.put("/update", authMiddleware, upload.single('img'), controller.update);
;
  
    app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));
  }
}

new server().init()


