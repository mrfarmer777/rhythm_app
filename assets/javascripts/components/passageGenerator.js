const SIMPLE_COUNT_STRINGS = {
    "0.500":"&",
    "0.250":"a",
    "0.750":"e",
    "0.333":"te",
    "0.667":"ta"
};



const passageGenerator = function(blocks){
    this.el = document.getElementById("target");
    this.measureBeats = 4;
    this.quaver = 4;
    this.quaverTicks = 4*4096/this.quaver;
    
    this.timeSignature = ""+this.measureBeats+"/"+this.quaver;
    this.beamGrouping = (this.timeSignature==="6/8" ? new VF.Fraction(3,8): new VF.Fraction(1,2))
    
    this.beamGroups=[];
    this.noteGroups=[];
    this.beamGroups2=[];
    this.noteGroups2=[];    
    this.getBeamGroup = function(beats, quaver){
        return new VF.Fraction(beats, quaver);
    };
    
    this.blocks = blocks;
    this.rhythmOptions=[];
    this.refresh = function(){
        this.blocks = getSelectedBlocks();
        this.rhythmOptions = this.blocks.map((b)=>{ return b.noteString });
        this.measureBeats = activeLevel.measureBeats;
        this.quaver = activeLevel.quaver;
        this.quaverTicks = 4*4096/this.quaver;
        this.timeSignature = ""+this.measureBeats+"/"+this.quaver;
        this.np.timeSignature = this.timeSignature;
        this.beamGrouping = this.getBeamGrouping();
        this.beamGroups=[];
        this.beamGroups2=[];
        this.noteGroups=[];
        this.noteGroups2=[];
        this.beatLength=this.measureLength*this.measureBeats;
        this.np.reset();
    };
    
    this.getBeamGrouping = function(beats){
        let res;
        if(activeLevel.compound){
            res = Array(beats).fill(new VF.Fraction(3,8));
        } else if(level==="e" || level==="4") {
            res = Array(beats).fill(new VF.Fraction(4,8));
        } else {
            res = Array(beats).fill(new VF.Fraction(1,4));
        }
        return res;
    };
    
    this.np = new notationPanel({ targetEl: this.el, panelType: "passage", timeSigBeats: this.measureBeats, timeSigQuaver: this.quaver});
    this.measureLength = 8;
    this.beatLength = this.measureLength*this.measureBeats;
    this.chooseRhythm = function(maxBeats){
        let filtered = filterBlocksByTicks(this.blocks, maxBeats*this.quaverTicks);
        if( filtered.length===0){ 
            const levelObj = getLevel(level);
            
            let maxTicks = levelObj.compound ? this.quaverTicks*3 : this.quaverTicks;
            filtered = [findBlockByTicks(FillerBlocks, maxTicks)] };

        return filtered[Math.floor(Math.random()*filtered.length)].noteString;
    };
    this.generate = function(){
        this.np.reset();
        this.np.resizeContents();
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
                let measureBeatsRemaining = (voice1.totalTicks.value()-voice1.ticksUsed.value())/(this.quaverTicks)%(this.measureBeats)  //calculate number of beats left in current measure
                if (measureBeatsRemaining === 0 ) { //Measure is completed, add a bar line and reset measureBeatsRemaining
                    if(voice1.tickables.length > 0 && !voice1.isComplete()){
                        let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                        voice1.addTickable(bar);
                    }
                    measureBeatsRemaining = this.measureBeats;
                }; //correct for beats left in the measure....
                let rhy = this.chooseRhythm(measureBeatsRemaining) //Choose a rhythm that fits within the beats remaining 
                let notes = notesFromString(rhy); //build notes from the rhythm string


                let blockTuplets = createTuplets(rhy, notes);
                this.np.tuplets = this.np.tuplets.concat(blockTuplets);
                let blockBeats = this.np.notesToBeats(notes, this.quaver);
                
                if(rhy.includes("s") || rhy.includes("e")){
                    this.noteGroups.push(notes);
                }
                
                //Adding Counts to Notes
                // let ticksPerBeat = voice1.time.resolution/voice1.time.beat_value;
                // notes.forEach((n)=>{
                //     let ticksRemaining = (voice1.totalTicks.value()-voice1.ticksUsed.value())
                //     let beatNumber = ((voice1.ticksUsed.value()/ticksPerBeat)%this.measureBeats)+1;
                //     let remainder = ((ticksRemaining/ticksPerBeat)%1).toFixed(3);
                //     let countingText = remainder === "0.000" ? beatNumber : SIMPLE_COUNT_STRINGS[remainder.toString()]
                    
                //     n.addAnnotation(0, new VF.Annotation(countingText).setVerticalJustification(3));
                //     voice1.addTickable(n);
                // });
                this.addCountsToNotes(voice1,notes);
            }
            
            this.noteGroups.forEach((ng)=>{
                this.beamGroups.push(new VF.Beam.generateBeams(ng, {groups: this.beamGrouping}));
            })
            
            let formatter = new VF.Formatter(); //instantiate formatter
            this.np.stave.setContext(this.np.context).draw();  //draw the stave
            
            formatter.joinVoices([voice1]).formatToStave([voice1], this.np.stave); //put the voice on the stave
            voice1.draw(this.np.context, this.np.stave); //draw the voice
            
            
            
            this.beamGroups.forEach((bg) => {
                bg.forEach((b)=>{
                    b.setContext(this.np.context).draw(); //draw the beams
                })
                    
            });
            this.np.tuplets.forEach((t)=>{
                t.setContext(this.np.context).draw(); //draw the tuplets
            })
            
            
            if(this.measureLength > 4){
                while(!voice2.isComplete()){ //while the voice is not filled...
                    let measureBeatsRemaining = (voice2.totalTicks.value()-voice2.ticksUsed.value())/(this.quaverTicks)%(this.measureBeats)  //calculate number of beats left in current measure
                    
                    if (measureBeatsRemaining === 0 ) { //Measure is completed, add a bar line and reset measureBeatsRemaining
                        if(voice2.tickables.length > 0 && !voice2.isComplete()){
                            let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                            voice2.addTickable(bar);
                        }
                        measureBeatsRemaining = this.measureBeats;
                    }; //correct for beats left in the measure....
                    
                    let rhy = this.chooseRhythm(measureBeatsRemaining) //Choose a rhythm that fits within the beats remaining 
                    let notes = notesFromString(rhy); //build notes from the rhythm string
                    let blockTuplets = createTuplets(rhy, notes);
                    this.np.tuplets2 = this.np.tuplets2.concat(blockTuplets);
                    
                    if(rhy.includes("s") || rhy.includes("e")){
                        this.noteGroups2.push(notes);
                    }

                    this.addCountsToNotes(voice2,notes);

                    // voice2.addTickables(notes); //add the notes to the voice
                }
                this.noteGroups2.forEach((ng)=>{
                    this.beamGroups2.push(new VF.Beam.generateBeams(ng, {groups: this.beamGrouping}));
                })
                
                let formatter = new VF.Formatter(); //instantiate formatter
                this.np.stave2.setContext(this.np.context).draw();  //draw the stave
                
                formatter.joinVoices([voice2]).formatToStave([voice2], this.np.stave2); //put the voice on the stave
                
                voice2.draw(this.np.context, this.np.stave2); //draw the voice
                
                
                this.beamGroups2.forEach((bg) => {
                    bg.forEach((b)=>{
                        b.setContext(this.np.context).draw(); //draw the beat
                    })
                });

                this.np.tuplets2.forEach((t)=>{
                    t.setContext(this.np.context).draw();
                })
            }
            
            
            
        }
            
            
            
        
    };
    this.addCountsToNotes = function(voice, notes){
        let ticksPerBeat = voice.time.resolution/voice.time.beat_value;
        notes.forEach((n)=>{
            let ticksRemaining = (voice.totalTicks.value()-voice.ticksUsed.value())
            let beatNumber = ((voice.ticksUsed.value()/ticksPerBeat)%this.measureBeats)+1;
            let remainder = ((ticksRemaining/ticksPerBeat)%1).toFixed(3);
            let countingText = remainder === "0.000" ? beatNumber : SIMPLE_COUNT_STRINGS[remainder.toString()]
            
            n.addAnnotation(0, new VF.Annotation(countingText).setVerticalJustification(3));
            voice.addTickable(n);
        });
    }    

    this.measureBeatsRemaining = function(){
        const measureRemainder = this.beatsRemaining()%this.measureBeats;
        return  ( measureRemainder === 0 ? this.measureBeats : measureRemainder );
    }
};