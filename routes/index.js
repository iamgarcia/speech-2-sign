var express = require('express');
var router = express.Router();

var videoURL = null;

// /* GET index page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { 
//     videoURL: 'https://storage.googleapis.com/s2s-sign-videos/hello.mp4' 
//   });
// });

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    videoURL 
  });
});

/* POST index page. */
router.post('/', function(req, res) {

});

module.exports = router;