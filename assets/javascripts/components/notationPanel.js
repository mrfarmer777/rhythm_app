//Building a notation panel object
function notationPanel(options){
  this.blockEl = options.targetEl;
  this.panelType = options.panelType;
  
  this.renderer = new VF.Renderer(this.blockEl,VF.Renderer.Backends.CANVAS);
  this.context = this.renderer.getContext();
 
  this.notes=[];
  this.notes2=[];
  this.autoBeaming = true;
  
  //Time signature handling
  this.numberOfMeasures = (this.panelType==="passage" ? 8:1);
  this.numberOfBeats = options.timeSigBeats;
  this.quaver=options.timeSigQuaver;
  this.timeSignature = ""+this.numberOfBeats+"/"+this.quaver;
  this.beamGrouping = (this.timeSignature==="4/4" ? new VF.Fraction(2,8): new VF.Fraction(3,8))


  
  this.toggleSelected = function(){
    return !this.selected;
  };
  
  this.formatter = new VF.Formatter;
  
  
  this.updateNotation=function(rhythmString){
    this.notes = notesFromString(rhythmString);
  };
  
  this.notesToBeats = function(notes, quaver){
    let totalBeats = 0;
    notes.forEach((n)=>{
      totalBeats += quaver/(n.duration);
      (n.dots > 0 ? totalBeats+=(quaver/(2*n.duration)): null );
    });
    return totalBeats;
  };
  
  this.beatLength = function(){
    return this.notesToBeats(this.notes, this.quaver);
  };
  
  
  this.resizeContents = function(){
    let width = this.blockEl.clientWidth;
    let height = this.blockEl.clientHeight;
    let measures = Math.round(this.notesToBeats(this.notes.concat(this.notes2), this.quaver)/this.quaver);
    this.renderer.resize(width, height);
    this.stave = new VF.Stave(width*0.05, -12, width*0.80, {
      left_bar: (this.panelType==="passage"),
      right_bar: (this.panelType==="passage")
    });
    this.stave
      .setConfigForLine(2, {visible: (this.panelType==="passage" ? true : false)})
      .setConfigForLine(0, {visible: false})
      .setConfigForLine(1, {visible: false})
      .setConfigForLine(3, {visible: false})
      .setConfigForLine(4, {visible: false});
      
    if(this.panelType==="passage"){
      this.stave.addClef('percussion');
      this.stave.addTimeSignature(this.timeSignature);
    }
    
    
    this.stave2 = new VF.Stave(width*0.05, 70, width*0.80).addClef('percussion').setEndBarType(VF.Barline.type.END);
    this.stave2
    .setConfigForLine(2, {visible: true})
    .setConfigForLine(0, {visible: false})
    .setConfigForLine(1, {visible: false})
    .setConfigForLine(3, {visible: false})
    .setConfigForLine(4, {visible: false});
  
  };
  
  this.reset = function(){
    this.notes=[];
    this.notes2=[];
    this.context.clear();
    this.numberOfBeats = (["t","u","v"].includes(level) ? 6:4);
    this.quaver = (["t","u","v"].includes(level) ? 8:4);
    this.timeSignature =""+this.numberOfBeats+"/"+this.quaver;
  };
  
  this.render = function(){
    this.resizeContents();
    let renderContext = this.context;

    this.stave.setContext(renderContext).draw();
    if(this.stave2){
      this.stave2.setContext(renderContext).draw();
    }
    
    let formatter = new VF.Formatter();
    
    if(this.notes.length > 0){
      
      let voice1 = new VF.Voice({num_beats: this.notesToBeats(this.notes, this.quaver), beat_value: this.quaver}).setMode(3);
     
      voice1.addTickables(this.notes);
     
      formatter.joinVoices([voice1]).formatToStave([voice1], this.stave);
      var beams = VF.Beam.generateBeams(voice1.tickables, {groups: [["t","u","v"].includes(level) ? new VF.Fraction(3,8) : new VF.Fraction(2,8)]})  //gen beams
      voice1.draw(this.context, this.stave);
      
     
      beams.forEach((b) => {
        b.setContext(this.context).draw(); //draw the beams
      });
    }
  };
}