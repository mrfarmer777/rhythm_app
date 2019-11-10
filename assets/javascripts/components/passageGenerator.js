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

    this.measureLength = 6;
    this.beatLength = this.measureLength*this.measureBeats;
    this.chooseRhythm = function(maxBeats){
        //let filtered = filterBlocksByBeatLength(this.blocks, maxBeats);
        let filtered = filterBlocksByTicks(this.blocks, maxBeats*4096);
        if( filtered.length===0){ filtered = filterBlocksByTicks(FillerBlocks, maxBeats*4096) };
        //if( filtered.length===0){ filtered = filterBlocksByBeatLength(FillerBlocks, maxBeats) };

        return filtered[Math.floor(Math.random()*filtered.length)].noteString;
    };
    this.generate = function(){
        this.np.reset();
        this.refresh();
        let rhy, notes, beats;
        if(this.rhythmOptions.length<2){
            alert("Please select 2 or more rhythm blocks to generate a rhythm passage.");
        } else {
            let rhy, notes, voice1, voice2;
            if(this.measureLength > 4){
                voice1 = new VF.Voice({ num_beats: this.beatLength/2, beat_value: this.quaver })  //Build a voice here, to be populated and sent to renderer
                voice2 = new VF.Voice({ num_beats: this.beatLength/2, beat_value: this.quaver })  //Build a voice here, to be populated and sent to renderer

            } else {
                voice1 = new VF.Voice({ num_beats: this.beatLength, beat_value: this.quaver })  //Build a voice here, to be populated and sent to renderer
            }
            
            while(!voice1.isComplete()){ //while the voice is not filled...
                let measureBeatsRemaining = (voice1.totalTicks.value()-voice1.ticksUsed.value())/(4096)%(4)  //calculate number of beats left in current measure
                
                if (measureBeatsRemaining === 0 ) { //Measure is completed, add a bar line and reset measureBeatsRemaining
                    if(voice1.tickables.length > 0 && !voice1.isComplete()){
                        let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                        voice1.addTickable(bar);
                    }
                    measureBeatsRemaining = 4;
                }; //correct for beats left in the measure....
                
                rhy = this.chooseRhythm(measureBeatsRemaining) //Choose a rhythm that fits within the beats remaining 
                notes = notesFromString(rhy); //build notes from the rhythm string
                voice1.addTickables(notes); //add the notes to the voice
            }
            
            var beams = VF.Beam.generateBeams(voice1.tickables, {groups: new VF.Fraction(2,8)})  //gen beams
            
            let formatter = new VF.Formatter(); //instantiate formatter
            this.np.stave.setContext(this.np.context).draw();  //draw the stave
            
            formatter.joinVoices([voice1]).formatToStave([voice1], this.np.stave); //put the voice on the stave
            
            voice1.draw(this.np.context, this.np.stave); //draw the voice
            
            
            beams.forEach((b) => {
                b.setContext(this.np.context).draw(); //draw the beams
            });
            
            
            if(this.measureLength > 4){
                while(!voice2.isComplete()){ //while the voice is not filled...
                    let measureBeatsRemaining = (voice2.totalTicks.value()-voice2.ticksUsed.value())/(4096)%(4)  //calculate number of beats left in current measure
                    
                    if (measureBeatsRemaining === 0 ) { //Measure is completed, add a bar line and reset measureBeatsRemaining
                        if(voice2.tickables.length > 0 && !voice2.isComplete()){
                            let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                            voice2.addTickable(bar);
                        }
                        measureBeatsRemaining = 4;
                    }; //correct for beats left in the measure....
                    
                    rhy = this.chooseRhythm(measureBeatsRemaining) //Choose a rhythm that fits within the beats remaining 
                    notes = notesFromString(rhy); //build notes from the rhythm string
                    voice2.addTickables(notes); //add the notes to the voice
                }
                
                var beams = VF.Beam.generateBeams(voice1.tickables, {groups: new VF.Fraction(2,8)})  //gen beams
            
                let formatter = new VF.Formatter(); //instantiate formatter
                this.np.stave2.setContext(this.np.context).draw();  //draw the stave
                
                formatter.joinVoices([voice2]).formatToStave([voice2], this.np.stave2); //put the voice on the stave
                
                voice2.draw(this.np.context, this.np.stave2); //draw the voice
                
                
                beams.forEach((b) => {
                    b.setContext(this.np.context).draw(); //draw the beams
                });
            }
            
            
            
        }
            
            
            
        
    };
    
    this.beatsRemaining = function(){
        return this.beatLength-this.np.notesToBeats(this.np.notes.concat(this.np.notes2),4);
    };
    
    this.measureBeatsRemaining = function(){
        const measureRemainder = this.beatsRemaining()%this.measureBeats;
        return  ( measureRemainder === 0 ? this.measureBeats : measureRemainder )
    }
};