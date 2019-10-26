//Building a notation panel object
function notationPanel(options){
  this.blockEl = options.targetEl;
  
  this.renderer = new VF.Renderer(this.blockEl,VF.Renderer.Backends.SVG);
  this.context = this.renderer.getContext();
  this.quaver=4;
  this.selected=false;
  this.notes=[];
  this.notes2=[];
  this.beams=[];
  
  
  this.toggleSelected = function(){
    return !this.selected;
  };
  
  this.formatter = new VF.Formatter();
  
  
  this.updateNotation=function(rhythmString){
    this.notes = notesFromString(rhythmString);
  };
  
  
  this.notesToBeats = function(notes, quaver){
    let totalMeasures = 0;
    notes.forEach((n) => { if(n.duration !=="b"){ totalMeasures += (1/n.duration) }});
    return totalMeasures*quaver;
  };
  
  this.buildVoice = function(beats,value){
    return new VF.Voice({ num_beats: beats, beat_value: value });
  };
  
  
  this.resizeContents = function(){
    let width = this.blockEl.offsetWidth;
    let measures = Math.round(this.notesToBeats(this.notes.concat(this.notes2), this.quaver)/this.quaver);
    this.renderer.resize(width, 160);
    this.stave = new VF.Stave(5,-20,width*0.90,75).addClef('percussion').addTimeSignature("4/4");
    if(measures > 4){
      console.log("should be two staves");
      this.stave2 = new VF.Stave(5, 60, width*0.90,75).addClef('percussion').setEndBarType(VF.Barline.type.END);
    }
  };
  
  this.render = function(){
    this.resizeContents();
    let totalBeats = this.notesToBeats(this.notes, this.quaver);
    let voice = this.buildVoice(totalBeats,this.quaver);
    //voice.addTickables(this.notes);
    this.stave.setContext(this.context).draw();
    if(this.stave2){
      this.stave2.setContext(this.context).draw();
    }
    //this.formatter.joinVoices([voice]).formatToStave([voice],this.stave);
    
    //this.updateBeams(this.notes);
    let renderContext = this.context;
    console.log(this.notes);
    console.log(this.notes2);
    VF.Formatter.FormatAndDraw(renderContext, this.stave, this.notes, { autobeam: true });
    if(this.stave2){
      VF.Formatter.FormatAndDraw(renderContext, this.stave2, this.notes2, { autobeam: true })
    }
    //this.beams.forEach(function(b){ b.setContext(renderContext).draw() });
  };
  
  
  this.updateBeams = function(notes){
    this.beams = VF.Beam.generateBeams(notes);
  };
  
  
  
  
  this.clearContext = function(){
    this.context.clear();
  };
}