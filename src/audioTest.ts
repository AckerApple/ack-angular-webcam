console.log("loading")
//stream.getAudioTracks()[0].stop()


// success callback when requesting audio input stream
function gotStream(stream) {
console.log("stream",stream)
    //window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext:AudioContext = new AudioContext();

    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource( stream );

    // Connect it to the destination to hear yourself (or any other node for processing!)
    mediaStreamSource.connect( audioContext.destination );
console.log("connected")
setTimeout(()=>{
  mediaStreamSource.disconnect()
}, 10000)
}

//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia(
  {audio:true},
  gotStream, 
  e=>{console.log('e',e)}
);

export const a=1

console.log("loaded")