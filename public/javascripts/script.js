'use strict'

var gumStream;
var recorder;
var input;

// shim for AudioContext when it's not available
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; // new audio context to help us record

function startRecording() {
    console.log('startRecording() called');

    var constraints = { audio: true, video: false }

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log('getUserMedia() success, stream created, initializing WebAudioRecorder...');

        /**
         *  Create an audio context after getUserMedia is called
         *  sampleRate might change after getUserMedia is called, like it does on macOS when
         *  recording through AirPods (the sampleRate defaults to the one set in your OS for
         *  your playback device)
         */
        audioContext = new AudioContext();

        // assign to gumStream for later use
        gumStream = stream;

        // use the stream
        input = audioContext.createMediaStreamSource(stream);

        recorder = new WebAudioRecorder(input, {
            workerDir: 'javascripts/lib/', // worker files directory
            numChannels: 1, // number of channels (mono)
            encoding: 'wav', // encoding
            onEncoderLoading: function(recorder, encoding) {
                console.log('Loading ' + encoding + ' encoder...');
            },
            onEncoderLoaded: function(recorder, encoding) {
                console.log(encoding + ' encoder loaded.');
            }
        });

        recorder.onComplete = function(recorder, blob) {
            console.log('Encoding complete.');
        }

        recorder.setOptions({
            timeLimit: 60, // recording time limit (seconds)
            encodeAfterRecord: false // process encoding on recording background
        });

        // start the recording process
        recorder.startRecording();

        console.log('Recording started.');
    }).catch(function(err) {
        console.log('getUserMedia() failure');
    });
}

function stopRecording() {
    console.log('stopRecording() called');

    // stop microphone access
    gumStream.getAudioTracks()[0].stop();

    // tell the recorder to finish the recording (stop recording)
    recorder.finishRecording();

    console.log('Recording stopped.');
}

var voiceActive = false;
var voiceButton = document.querySelector('#voiceButton');
var voicePrompt = document.querySelector('#voicePrompt');
var voiceIcon = document.querySelector('#voiceIcon');
var voiceIndicator = document.querySelector('#voiceIndicator');

voiceButton.addEventListener('click', function() {
    if(!voiceActive) { // Toggle button on

        voiceIcon.setAttribute('src', 'images/waveform.svg');
        voicePrompt.innerHTML = 'Listening...';
        playChime();
        startRecording();

        voiceActive = true;
    } else { // Toggle button off
        console.log('Turned off');

        voiceIcon.setAttribute('src', 'images/mic.svg');
        voicePrompt.innerHTML = 'Click the microphone icon and speak';
        stopChime()
        stopRecording();

        voiceActive = false;
    }
});

function playChime() {
    voiceIndicator.volume = 0.3;
    voiceIndicator.play();
}

function stopChime() {
    voiceIndicator.pause();
    voiceIndicator.currentTime = 0;
}