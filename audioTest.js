"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("loading");
//stream.getAudioTracks()[0].stop()
// success callback when requesting audio input stream
function gotStream(stream) {
    console.log("stream", stream);
    //window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination to hear yourself (or any other node for processing!)
    mediaStreamSource.connect(audioContext.destination);
    console.log("connected");
    setTimeout(function () {
        mediaStreamSource.disconnect();
    }, 10000);
}
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia({ audio: true }, gotStream, function (e) { console.log('e', e); });
exports.a = 1;
console.log("loaded");
//# sourceMappingURL=audioTest.js.map