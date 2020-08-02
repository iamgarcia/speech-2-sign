var express = require('express');
var router = express.Router();

var randomString = require('randomstring');

/**
 *  Multer stuff
 */
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, randomString.generate({
      length: 10,
      charset: 'alphanumeric'
    }) + '.wav');
  }
});
var upload = multer({ storage: storage });

var videoURL = null;

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    videoURL 
  });
});

/* POST index page. */
router.post('/', upload.single('audio-file'), function(req, res) {
  
});

module.exports = router;