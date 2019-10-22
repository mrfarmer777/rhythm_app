//Building a notation panel object
function notationPanel(options){
  this.targetEl = options.targetEl;
  this.renderer = new VF.Renderer(this.targetEl,VF.Renderer.Backends.SVG);
  this.context = this.renderer.getContext();
  this.quaver=4;
  this.notes=[];
  this.beams=[];
  this.formatter = new VF.Formatter();
  this.stave = new VF.Stave(10,40,400).addClef('percussion').addTimeSignature("4/4");
  
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