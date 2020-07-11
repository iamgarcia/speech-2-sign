var voiceActive = false;
var voiceButton = document.querySelector('img#center-svg');
var voicePrompt = document.querySelector('h5#center-log');
voiceButton.addEventListener('click', function() {
    if(voiceActive) {
        voiceActive = false;
        voiceButton.setAttribute('src', 'images/mic.svg');
        voicePrompt.innerHTML = 'Click the microphone icon and speak';
        stopChime();
    } else {
        voiceActive = true;
        voiceButton.setAttribute('src', 'images/waveform.svg');
        voicePrompt.innerHTML = 'Listening...';
        playChime();
    }
});


var voiceIndicator = document.querySelector('#voiceIndicator');

function playChime() {
    voiceIndicator.volume = 0.3;
    voiceIndicator.play();
}

function stopChime() {
    voiceIndicator.pause();
    voiceIndicator.currentTime = 0;
}