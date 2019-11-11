
var woodblock = new Tone.Synth().toMaster();

woodblock.envelope.sustain=0.01
woodblock.envelope.release=0.01


//Play a 'ts'
function ts(){
  woodblock.triggerAttackRelease("f5", "16n");
}

//Hacky way to play a loop.
let count=1;
var loop = new Tone.Loop(function(time){
	//triggered every eighth note. 
	if(count%2===1){
    ts();
	}
  if(count===8){
    count=1;
  } else {
    count++;
  }
}, "8n").start(0);

//Setup the transport 
Tone.Transport.bpm.value=parseInt(document.getElementById("bpm").value, 10);
function updateBpm(){
  let bpm = parseInt(document.getElementById("bpm").value, 10);
  if(bpm < 300 && bpm > 30){
    Tone.Transport.bpm.value=bpm;
  } else {
    document.getElementById("bpm").value=Tone.Transport.bpm.value;
  }
}



//Start the loop.
function play(){  
  updateBpm();
  Tone.Transport.start();
}

function stop(){
  Tone.Transport.stop();
}
