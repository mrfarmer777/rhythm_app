const passageGenerator = function(blocks){
    this.el = document.getElementById("target")
    this.blocks = blocks;
    this.np = new notationPanel({ targetEl: this.el });
    this.rhythmOptions = blocks.map((b)=>{ return b.noteString });
    this.measureLength = 8;
    this.beatLength = 8*4;
    this.chooseRhythm = function(){
        return this.rhythmOptions[Math.floor(Math.random()*this.rhythmOptions.length)];
    };
    this.generate = function(){
        //while the passage isn't full
        let rhy, notes, beats;
        while(this.beatsRemaining() > 0){
            rhy = this.chooseRhythm();//select a rhythm
            console.log(rhy);
            notes = notesFromString(rhy);//turn it into notes
            beats = this.np.notesToBeats(notes,4)//calculate the length of those notes in beats
            if(beats <= this.beatsRemaining()){//if adding to the passage won't over fill it, 
                notes.forEach((n)=>{
                    this.np.notes.push(n);//add it in
                });
            }
            console.log(this.np.notes);
        }
        this.np.render();
    };
    
    this.beatsRemaining = function(){
        return this.beatLength-this.np.notesToBeats(this.np.notes,4);
    };
};