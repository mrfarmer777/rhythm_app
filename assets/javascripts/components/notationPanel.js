//Building a notation panel object
function notationPanel(options){
  this.blockEl = options.targetEl;
  this.panelType = options.panelType;
  
  this.renderer = new VF.Renderer(this.blockEl,VF.Renderer.Backends.CANVAS);
  this.context = this.renderer.getContext();
  this.numberOfBeats = 4;
  this.quaver=4;
  this.timeSignature = ""+this.numberOfBeats+"/"+this.quaver;
  this.notes=[];
  this.notes2=[];
  this.autoBeaming = true;

  
  this.toggleSelected = function(){
    return !this.selected;
  };
  
  this.formatter = new VF.Formatter;
  
  
  this.updateNotation=function(rhythmString){
    this.notes = notesFromString(rhythmString);
  };
  
  this.notesToBeats = function(notes, quaver){
    let totalMeasures = 0;
    notes.forEach((n) => { 
      if(n.duration !=="b"){
        let noteDur=n.duration.match(/\d+/)[0];
        totalMeasures += (1/noteDur)+((1/noteDur)*0.5*n.dots);
      }      
    });
    return totalMeasures*quaver;
  };
  
  this.beatLength = function(){
    return this.notesToBeats(this.notes, this.quaver);
  };
  
  
  this.resizeContents = function(){
    let width = this.blockEl.clientWidth;
    let height = this.blockEl.clientHeight;
    let measures = Math.round(this.notesToBeats(this.notes.concat(this.notes2), this.quaver)/this.quaver);
    this.renderer.resize(width, height);
    this.stave = new VF.Stave(width*0.05, -12, width*0.90, {
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
    
    
    if(measures > 4){
      this.stave2 = new VF.Stave(width*0.05, 70, width*0.90).addClef('percussion').setEndBarType(VF.Barline.type.END);
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
    this.context.clear();
  };
  
  this.render = function(){
    this.resizeContents();
    let renderContext = this.context;

    this.stave.setContext(renderContext).draw();
    if(this.stave2){
      this.stave2.setContext(renderContext).draw();
    }
    
    VF.Formatter.FormatAndDraw(renderContext, this.stave, this.notes, this.autoBeaming);
    if(this.stave2){
      VF.Formatter.FormatAndDraw(renderContext, this.stave2, this.notes2, this.autoBeaming)
    }
    
  };
}