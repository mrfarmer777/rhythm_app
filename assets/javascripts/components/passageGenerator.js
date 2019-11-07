const passageGenerator = function(blocks){
    this.el = document.getElementById("target");
    this.measureBeats = 4;
    this.quaver = 4;
    this.blocks = blocks;
    this.rhythmOptions=[];
    this.refresh = function(){
        this.blocks = getSelectedBlocks();
        this.rhythmOptions = this.blocks.map((b)=>{ return b.noteString });
    };
    this.np = new notationPanel({ targetEl: this.el, panelType: "passage" });

    this.measureLength = 8;
    this.beatLength = 8*this.measureBeats;
    this.chooseRhythm = function(maxBeats){
        let filtered = filterBlocksByBeatLength(this.blocks, maxBeats);
        if( filtered === []){ filtered = filterBlocksByBeatLength(FillerBlocks, maxBeats) };
        return filtered[Math.floor(Math.random()*filtered.length)].noteString;
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
                rhy = this.chooseRhythm(this.measureBeatsRemaining());//select a rhythm
                notes = notesFromString(rhy);//turn it into notes
                beats = this.np.notesToBeats(notes,4);//calculate the length of those notes in beats
                if(beats <= this.beatsRemaining()){//if adding to the passage won't over fill the current measure...
                    notes.forEach((n)=>{
                        let targetNoteArray = ( (this.beatsRemaining()<=(this.beatLength/2) ) ? this.np.notes : this.np.notes2 );
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
    
    this.measureBeatsRemaining = function(){
        const measureRemainder = this.beatsRemaining()%this.measureBeats;
        return  ( measureRemainder === 0 ? this.measureBeats : measureRemainder )
    }
};