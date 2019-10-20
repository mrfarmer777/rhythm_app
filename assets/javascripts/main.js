//VexFlow Boilerplate
VF = Vex.Flow;
//var el = document.getElementById("target");
//var renderer = new VF.Renderer(el, VF.Renderer.Backends.SVG);
//renderer.resize(500,500);


//var context = renderer.getContext();

//Building the stave
//var stave = new VF.Stave(10,40,400);
//stave.addClef('percussion').addTimeSignature("4/4");
//var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });


function notesFromString(noteString){
  //Enter in a string of notes like so: qqeeeeq
  let notes = [];
  const durationCharacters = {
    "w": "1",
    "h": "2",
    "q": "4",
    "e": "8",
    "s": "16"
  };
  
  noteString.split('').map( (n)=>{
    let dur = durationCharacters[n];
    notes.push(new VF.StaveNote({
      clef: "treble",
      keys: ["b/4"],
      duration: dur
    }));
  });
  return notes;
}
  
//voice.addTickables(notes);

//var formatter = new VF.Formatter().joinVoices([voice]).format([voice],400);

//stave.setContext(context).draw();
//var beams = VF.Beam.generateBeams(notes);
//VF.Formatter.FormatAndDraw(context,stave,notes);

//beams.forEach(function(b) {b.setContext(context).draw()});


//Building a notation panel object
function notationPanel(options){
  this.targetEl = options.targetEl;
  this.renderer = new VF.Renderer(this.targetEl,VF.Renderer.Backends.SVG);
  this.context = this.renderer.getContext();
  this.quaver=4;
  this.notes=[];
  this.beams=[];
  this.formatter = new VF.Formatter();
  this.updateNotation=function(rhythmString){
    this.notes = [];
    this.notes = notesFromString(rhythmString);
  };
  this.notesToBeats = function(notes, quaver){
    let totalMeasures = 0;
    notes.forEach((n) => { totalMeasures += (1/n.duration) });
    return totalMeasures*quaver;
  };
  
  this.stave = new VF.Stave(10,40,400).addClef('percussion').addTimeSignature("4/4");
  this.buildVoice = function(beats,value){
    return new VF.Voice({ num_beats: beats, beat_value: value });
  };
  this.render = function(){
    this.clearContext();
    this.renderer.resize(500,500);
    let totalBeats = this.notesToBeats(this.notes, this.quaver);
    let voice = this.buildVoice(totalBeats,this.quaver);
    voice.addTickables(this.notes);
    this.stave.setContext(this.context).draw();
    this.formatter.joinVoices([voice]).format([voice]);
    
    this.updateBeams(this.notes);
    let renderContext = this.context;
    VF.Formatter.FormatAndDraw(renderContext, this.stave, this.notes);
    this.beams.forEach(function(b){ b.setContext(renderContext).draw() });
  };
  this.updateBeams = function(notes){
    this.beams = VF.Beam.generateBeams(notes);
  };
  this.clearContext = function(){
    this.context.clear();
  };
}




let example = new notationPanel({ targetEl: document.getElementById("target") });

example.updateNotation("eeqeeq");
example.render();


const updateMusic = function(){
  let noteInput = document.getElementById("note-input");
  let noteString = noteInput.value;
  example.updateNotation(noteString);
  example.render();
};


const clearMusic = function(){
  console.log('blarg');
  example.renderer.getContext().clear();
};
