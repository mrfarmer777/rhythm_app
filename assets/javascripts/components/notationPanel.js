//Building a notation panel object
function notationPanel(options){
  this.blockEl = options.targetEl;
  this.panelType = options.panelType;
  
  this.renderer = new VF.Renderer(this.blockEl,VF.Renderer.Backends.CANVAS);
  this.context = this.renderer.getContext();
  this.quaver=4;
  this.notes=[];
  this.notes2=[];

  
  this.toggleSelected = function(){
    return !this.selected;
  };
  
  this.formatter = new VF.Formatter();
  
  
  this.updateNotation=function(rhythmString){
    this.notes = notesFromString(rhythmString);
  };
  
  
  this.notesToBeats = function(notes, quaver){
    let totalMeasures = 0;
    notes.forEach((n) => { 
      if(n.duration !=="b"){
        totalMeasures += (1/n.duration) }});
    return totalMeasures*quaver;
  };
  
  
  
  
  this.resizeContents = function(){
    let width = this.blockEl.clientWidth;
    let height = this.blockEl.clientHeight;
    let measures = Math.round(this.notesToBeats(this.notes.concat(this.notes2), this.quaver)/this.quaver);
    this.renderer.resize(width, height);
    this.stave = new VF.Stave(width*0.05, -12, width*0.90, {
      left_bar: false,
      right_bar: false
    });
    this.stave
      .setConfigForLine(2, {visible: (this.panelType==="passage" ? true : false)})
      .setConfigForLine(0, {visible: false})
      .setConfigForLine(1, {visible: false})
      .setConfigForLine(3, {visible: false})
      .setConfigForLine(4, {visible: false});
      
    if(this.panelType==="passage"){
      this.stave.addClef('percussion');
      this.stave.addTimeSignature("4/4");
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

    
    VF.Formatter.FormatAndDraw(renderContext, this.stave, this.notes, { autobeam: true });
    if(this.stave2){
      VF.Formatter.FormatAndDraw(renderContext, this.stave2, this.notes2, { autobeam: true })
    }
  };
}