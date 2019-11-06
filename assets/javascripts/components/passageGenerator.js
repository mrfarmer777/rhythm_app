const passageGenerator = function(blocks){
    this.el = document.getElementById("target");
    this.blocks = blocks;
    this.rhythmOptions=[];
    this.refresh = function(){
        this.blocks = getSelectedBlocks();
        this.rhythmOptions = this.blocks.map((b)=>{ return b.noteString });
    };
    this.np = new notationPanel({ targetEl: this.el, panelType: "passage" });

    this.measureLength = 8;
    this.beatLength = 8*4;
    this.chooseRhythm = function(){
        return this.rhythmOptions[Math.floor(Math.random()*this.rhythmOptions.length)];
    };
    this.generate = function(){
        this.np.reset();
        this.refresh();
        let rhy, notes, beats;
        if(this.rhythmOptions.length<2){
            alert("Please select 2 or more rhythm blocks to generate a rhythm passage.");
        } else {
            //while the passage isn't full
            let rhy, notes, beats;
            while(this.beatsRemaining() > 0){
                rhy = this.chooseRhythm();//select a rhythm
                notes = notesFromString(rhy);//turn it into notes
                beats = this.np.notesToBeats(notes,4);//calculate the length of those notes in beats
                if(beats <= this.beatsRemaining()){//if adding to the passage won't over fill it, 
                    notes.forEach((n)=>{
                        let targetNoteArray = ((this.beatsRemaining()<=(this.beatLength/2)) ? this.np.notes : this.np.notes2 );
                        targetNoteArray.push(n);
                        if(this.beatsRemaining()%4===0 && this.beatsRemaining()%16!==0){
                            let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                            targetNoteArray.push(bar);
                        }
                    });
                    
                }
            }
        }
        this.np.render();
    };
    
    this.beatsRemaining = function(){
        return this.beatLength-this.np.notesToBeats(this.np.notes.concat(this.np.notes2),4);
    };
};