//Building a notation panel object
function notationPanel(options){
  this.blockEl = options.targetEl;
  this.panelType = options.panelType;
  
  this.renderer = new VF.Renderer(this.blockEl,VF.Renderer.Backends.CANVAS);
  this.context = this.renderer.getContext();
 
  this.notes=[];
  this.notes2=[];
  this.autoBeaming = true;

  this.tuplets=[];
  this.tuplets2=[];  
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
    this.tuplets = createTuplets(rhythmString, this.notes);
  };
  
  this.notesToBeats = function(notes, quaver){
    let totalBeats = 0;
    let trialBeats = 0;
    notes.forEach((n)=>{
      //totalBeats = (n.ticks.value())/4096
      //Old calculation using the duration instead of ticks
      totalBeats += quaver/(n.duration);
      (n.dots > 0 ? totalBeats+=(quaver/(2*n.duration)): null );

      trialBeats += n.ticks.value()/4096;
    });
    return trialBeats;
  };

  this.notesToTicks = function(notes){
    let ticks = 0;
    notes.forEach(n => { ticks += n.ticks.value(); })
    return ticks;
  }
  
  this.beatLength = function(){
    return this.notesToBeats(this.notes, this.quaver);
  };

  this.totalTicks = function(){
    return this.notesToTicks(this.notes);
  }
  
  
  this.resizeContents = function(){
    let width = this.blockEl.clientWidth;
    let height = this.blockEl.clientHeight;
    let measures = Math.round(this.notesToBeats(this.notes.concat(this.notes2), this.quaver)/this.quaver);
    this.renderer.resize(width, height);
    this.stave = new VF.Stave(width*0.00, -12, width*0.98, {
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
    
    
    this.stave2 = new VF.Stave(width*0.00, 70, width*0.98).addClef('percussion').setEndBarType(VF.Barline.type.END);
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
    this.tuplets=[];
    this.tuplets2=[];
    this.context.clear();
    //this.numberOfBeats = (["t","u","v","8"].includes(level) ? 6:4);
    this.quaver = (["5","6","7","8"].includes(level) ? 8:4);
    //this.timeSignature =""+this.numberOfBeats+"/"+this.quaver;
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
      var beams = VF.Beam.generateBeams(voice1.tickables, {groups: [["5","6","7","8"].includes(level) ? new VF.Fraction(3,8) : new VF.Fraction(2,8)]})  //gen beams
      voice1.draw(this.context, this.stave);
      this.tuplets.forEach((t)=>{
        t.setContext(renderContext).draw();
      })
      
     
      beams.forEach((b) => {
        b.setContext(this.context).draw(); //draw the beams
      });
    }
  };
}