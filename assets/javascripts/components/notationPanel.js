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

  this.ties = [];
  this.ties2 = [];

  //Time signature handling
  this.numberOfMeasures = (this.panelType==="passage" ? 8:1);
  this.numberOfBeats = options.timeSigBeats;
  this.quaver=options.timeSigQuaver;
  this.timeSignature = ""+this.numberOfBeats+"/"+this.quaver;
  this.beamGrouping = (["6/8","3/8","12/8"].includes(this.timeSignature) ? new VF.Fraction(3,8): new VF.Fraction(2,8));

  this.toggleSelected = function(){
    return !this.selected;
  };
  
  this.formatter = new VF.Formatter;
  
  this.updateTimeSignature = function(measureBeats, quaver){
    this.numberOfBeats = measureBeats;
    this.quaver=quaver;
    this.timeSignature = `${this.numberOfBeats}/${this.quaver}`
    this.beamGrouping = (["6/8","3/8","12/8"].includes(this.timeSignature) ? new VF.Fraction(3,8): new VF.Fraction(2,8));
  }
  
  this.updateNotation=function(rhythmString){
    this.notes = notesFromString(rhythmString);
    this.tuplets = createTuplets(rhythmString, this.notes);
    this.ties = createTiesFromRhythmString(rhythmString, this.notes);
  };
  
  this.notesToBeats = function(notes, quaver){
    let totalBeats = 0;

    //Creating a stavenote from the quaver for comparison/calculation
    const q = new VF.StaveNote({
      clef: "treble",
      keys: ["a/4"],
      duration: quaver.toString(),
      auto_stem: false,
      stem_direction: 1
    });
    notes.forEach((n)=>{
      totalBeats += n.ticks.value()/q.ticks.value();
    });
    return totalBeats;
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
  };
  
  this.resizeContents = function(){
    let width = this.blockEl.clientWidth;
    let height = this.blockEl.clientHeight;
    let measures = Math.round(this.notesToBeats(this.notes.concat(this.notes2), this.quaver)/this.quaver);
 
    this.renderer.resize(width, height);
    
    this.stave = new VF.Stave(width*0.01 , -12, width*0.98, {
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
      
      this.stave2 = new VF.Stave(width*0.01, 110, width*0.98).addClef('percussion').setEndBarType(VF.Barline.type.END);
      this.stave2
      .setConfigForLine(2, {visible: true})
      .setConfigForLine(0, {visible: false})
      .setConfigForLine(1, {visible: false})
      .setConfigForLine(3, {visible: false})
      .setConfigForLine(4, {visible: false});
    }
  };
  
  this.reset = function(){
    this.notes=[];
    this.notes2=[];
    this.tuplets=[];
    this.tuplets2=[];
    this.ties=[];
    this.ties2=[];
    this.context.clear();
  };
  
  this.render = function(){
    this.resizeContents();
    let renderContext = this.context;
    if (this.panelType !== "passage"){
      let scaleFactor;
      if(this.notes.length > 10){
        scaleFactor = 0.50; 
        this.stave.setY(24);
      } else {
        scaleFactor = 0.75;
        this.stave.setY(0);
        const adjustedStaveWidth = this.blockEl.clientWidth * (0.50 + (this.notes.length*0.1))
        let staveWidth = Math.min(adjustedStaveWidth, this.blockEl.clientWidth);
        let staveX = (this.blockEl.clientWidth*0.5)-staveWidth*0.5;
        this.stave.setX(staveX);
        this.stave.setWidth(staveWidth);
      }
      renderContext.scale(scaleFactor, scaleFactor);
      this.stave.setWidth(this.stave.width/scaleFactor);
    } else {
      scaleFactor=0.90;
      renderContext.scale(scaleFactor, scaleFactor);
      this.stave.setWidth(this.stave.width/scaleFactor);
      this.stave2.setWidth(this.stave2.width/scaleFactor);
    }

    this.stave.setContext(renderContext).draw();
    
    if(this.stave2){
      this.stave2.setContext(renderContext).draw();
    }
    
    //SoftmaxFactor is set to 100 by default, but gives rise to very strange spacing issues
    //especially with dotted rhythms. This setting corrects that.
    let formatter = new VF.Formatter({softmaxFactor: 2});    
    
    if(this.notes.length > 0){
      let voice1 = new VF.Voice({num_beats: this.numberOfBeats, beat_value: this.quaver}).setMode(3);
      voice1.addTickables(this.notes);
      
      formatter.joinVoices([voice1]).formatToStave([voice1], this.stave);      

      let compoundLevelNames = getCompoundLevelNames(CompoundLevels);
      let beams = VF.Beam.generateBeams(voice1.tickables, {groups: [compoundLevelNames.includes(level) ? new VF.Fraction(3,8) : new VF.Fraction(2,8)]})  //gen beams
      voice1.draw(this.context, this.stave);
      this.tuplets.forEach((t)=>{
        t.setContext(renderContext).draw();
      })

      this.ties.forEach((t)=>{
        t.setContext(renderContext).draw();
      })      
     
      beams.forEach((b) => {
        b.setContext(this.context).draw(); //draw the beams
      });
    }
  };
}