var express = require('express');
var router = express.Router();
var randomString = require('randomstring');
var speech = require('@google-cloud/speech');
var fs = require('fs');
var sox = require('sox.js');
var json_data = require('../public/classes.json');

// initialize multer storage
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.wav');
  }
});
var upload = multer({ storage: storage });

// create array of words
var words = [];
for(var i in json_data)
  words.push(json_data[i]);

// check if a word exists within the array of words
function wordExists(res) {
  return words.includes(res);
}

function createVideoURL(res) {
  return 'https://storage.googleapis.com/s2s-sign-videos/' + res + '.mp4';
}

// process user audio using Google's Cloud Speech-to-Text API
async function speechToText(req) {
  
  // create a client
  const client = new speech.SpeechClient();

  // the name of the audio file to transcribe
  const fileName = req;

  // reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };

  // the audio file's encoding, sample rate in hertz, and BCP-47 language code
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  // detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}

var videoURL = null;
var textDisplay = null;

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index', { 
    videoURL,
    textDisplay
  });
});

var text;
var url;

/* POST index page. */
router.post('/', upload.single('audio-file'), function(req, res) {
  
  // transcode the .wav file
  sox({
    soxPath: 'C:\\Program Files (x86)\\sox-14-4-2\\sox.exe',
    inputFile: req.file.path,
    output: {
      bits: 16,
      rate: 16000,
      channels: 1
    },
    outputFile: req.file.destination + '/' + randomString.generate({ length: 10, charset: 'alphanumeric' }) + '.wav'
  }, function done(err, outputFilePath) {
    if(err) {
      console.log('Sox Error: ' + err);
    } else {
      
      // delete the original .wav file
      fs.unlinkSync(req.file.path);

      // transcribe the new .wav file
      speechToText(outputFilePath).then(function(transcribe) {

        // delete the new .wav file
        fs.unlinkSync(outputFilePath);

        text = transcribe.toLowerCase();

        // check if res is empty
        if(text === '') {
          console.log('Response is empty');
        } else {
          console.log(text);

          // send response and video url to front-end
          if(wordExists(text)) {
            url = createVideoURL(text);
          } else {
            url = null;
          }
        }
      });
    }
  });
});

module.exports = router;