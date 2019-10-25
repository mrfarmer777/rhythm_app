//Building a notation panel object
function notationPanel(options){
  this.blockEl = options.targetEl;
  
  this.renderer = new VF.Renderer(this.blockEl,VF.Renderer.Backends.SVG);
  this.context = this.renderer.getContext();
  this.quaver=4;
  this.selected=false;
  this.notes=[];
  this.beams=[];
  
  
  this.toggleSelected = function(){
    return !this.selected;
  };
  
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
  
  this.buildVoice = function(beats,value){
    return new VF.Voice({ num_beats: beats, beat_value: value });
  };
  
  
  this.resizeContents = function(){
    let width = this.blockEl.offsetWidth;
    this.renderer.resize(width, 80);
    this.stave = new VF.Stave(5,-20,width*0.90,75).addClef('percussion').addTimeSignature("4/4");
  };
  
  this.render = function(){
    console.log(this.noteString);
    this.resizeContents();
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