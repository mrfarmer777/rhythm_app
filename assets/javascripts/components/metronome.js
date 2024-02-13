var audioContext = null;
var unlocked = false;
var isPlaying = false;
var startTime;
var current16thNote;
var tempo = 120.0;
var lookahead = 25.0;
var scheduleAheadTime = 0.1;
var nextNoteTime = 0.0;
var noteResolution = 0;
var noteLength = 0.05;
var canvas
var notesInQueue = [];
var timerWorker = null;
var measure16thNotes;
var restartNeeded = false;

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function nextNote() {
    var secondsPerBeat = 60.0 / tempo;
    const beatFraction = tupletsOn ? 0.1667 : 0.25;
    nextNoteTime += beatFraction * secondsPerBeat;
    current16thNote++;
    if (current16thNote == measure16thNotes) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution==1) && (beatNumber%2))
        return;
    if ( (noteResolution==0) && (beatNumber%(tupletsOn ? 6:4)) )
        return;

    let osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    osc.frequency.value = 440.0
    osc.start( time );
    osc.stop( time + noteLength );
}

function scheduler() {
    if(restartNeeded){
        restart();
    }
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}

function play() {
    if (!unlocked) {
      let buffer = audioContext.createBuffer(1, 1, 22050);
      let node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }

    isPlaying = !isPlaying;
    const button = document.querySelector('#metronome-button')
    button.className = "control-button item "+(isPlaying ? "selected": "");

    if (isPlaying) { // start playing
        const measureBeats = getTimeSigBeats();
        const pulseNote = getTimeSigQuaver();

        current16thNote = 0;
        measure16thNotes = (16/pulseNote) * measureBeats
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        
        return "start";
    }
}

function restart(){
    restartNeeded = false;
    if(isPlaying){
        play();
        play();
    } 
}


function init(){
  /*
  // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
  // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
  // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
  // spec-compliant, and work on Chrome, Safari and Firefox.
  */
  audioContext = new AudioContext();
  timerWorker = new Worker("assets/javascripts/components/metronomeWorker.js");

  timerWorker.onmessage = function(e) {
      if (e.data == "tick") {
          scheduler();
      } else {
          console.log("message: " + e.data);
      }
  };
  timerWorker.postMessage({"interval":lookahead});
}

window.addEventListener("load", init );

