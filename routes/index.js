var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { videoURL: 'https://storage.googleapis.com/s2s-sign-videos/adopt.mp4' });
});

module.exports = router;