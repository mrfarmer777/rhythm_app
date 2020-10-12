const SIMPLE_COUNT_STRINGS = {
    "0.500":"&",
    "0.250":"a",
    "0.750":"e",
    "0.333":"ta",
    "0.667":"te",
    "1.000":"",
    "0.833":"&",
    "0.167":"&",
};

const COMPOUND_COUNT_STRINGS = {
    "0.500":"&",
    "0.250":"a",
    "0.750":"e",
    "0.333":"ta",
    "0.667":"te",
    "0.167":"&",
    "0.833":"&",
}

const SMALLEST_DURATION = 16;


const passageGenerator = function(blocks){
    this.el = document.getElementById("target");
    this.formatter = new VF.Formatter();
    this.measureBeats = 4; 
    this.quaver = 4;
    this.quaverTicks = 4*4096/this.quaver;
    this.smallestDuration = SMALLEST_DURATION;
    
    this.timeSignature = ""+this.measureBeats+"/"+this.quaver;
    this.beamGrouping = (this.timeSignature==="6/8" ? new VF.Fraction(3,8): new VF.Fraction(1,2))
    
    this.voice1;
    this.beamGroups=[];
    this.noteGroups=[];

    this.voice1Notes;
    this.voice1Counts;

    this.voice2;
    this.beamGroups2=[];
    this.noteGroups2=[]; 
    this.voice2Notes;

    this.tuplets=[];
    this.tuplets2=[];

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
        this.tuplets=[];
        this.tuplets2=[];
        this.beatLength=this.measureLength*this.measureBeats;
        passageGenerated = false;
        this.np.reset();
    };

    this.redraw=function(){
        this.np.reset();
        this.np.render();
        this.np.context.setFont
        
        this.formatter.joinVoices([this.voice1])
            .joinVoices([this.voice1Counts])
            .formatToStave([this.voice1, this.voice1Counts], this.np.stave);   
        this.formatter.joinVoices([this.voice2])
            .joinVoices([this.voice2Counts])
            .formatToStave([this.voice2, this.voice2Counts], this.np.stave2); //put the voice on the stave //put the voice on the stave
        this.voice1.draw(this.np.context, this.np.stave);
        this.voice2.draw(this.np.context, this.np.stave2);
        this.drawBeamGroups(this.beamGroups);
        this.drawBeamGroups(this.beamGroups2);

        this.drawTuplets(this.tuplets2);
        this.drawTuplets(this.tuplets);
        if(countsOn){
            this.voice1Counts.draw(this.np.context, this.np.stave);
            this.voice2Counts.draw(this.np.context, this.np.stave2);
        }
    };

    this.removeCounts = function(){
        this.voice1.tickables.forEach((t)=>{
            t.modifiers = t.modifiers.filter((m)=>{return m.attrs.type!=="Annotation"});
        })
        this.voice2.tickables.forEach((t)=>{
            t.modifiers = t.modifiers.filter((m)=>{return m.attrs.type!=="Annotation"});
        })
    };

    this.showCounts = function(){
        this.addCountsToNotes(this.voice1);
        this.addCountsToNotes(this.voice2);
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
        if( filtered.length === 0){ 
            const levelObj = getLevel(level);
            
            let maxTicks = levelObj.compound ? this.quaverTicks*3 : this.quaverTicks;
            filtered = [findBlockByTicks(FillerBlocks, maxTicks)] };

        return filtered[Math.floor(Math.random()*filtered.length)].noteString;
    };

    this.generate = function(){
        this.np.reset();
        this.np.resizeContents();
        this.refresh();

        // Setting the context here so it is available for the textNotes which need it for some reason. 
        this.np.stave.setContext(this.np.context).draw();  //draw the stave

        if(this.rhythmOptions.length<2){
            alert("Please select 2 or more rhythm blocks to generate a rhythm passage.");
        } else {
            if(this.measureLength > 4){
                this.voice1 = new VF.Voice({ num_beats: this.beatLength/2, beat_value: this.quaver });  //Build a voice here, to be populated and sent to renderer
                this.voice2 = new VF.Voice({ num_beats: this.beatLength/2, beat_value: this.quaver });  //Build a voice here, to be populated and sent to renderer
            } else {
                this.voice1 = new VF.Voice({ num_beats: this.beatLength, beat_value: this.quaver })  //Build a voice here, to be populated and sent to renderer
            }
            while(!this.voice1.isComplete()){ //while the voice is not filled...
                let measureBeatsRemaining = (this.voice1.totalTicks.value()-this.voice1.ticksUsed.value())/(this.quaverTicks)%(this.measureBeats)  //calculate number of beats left in current measure
                if (measureBeatsRemaining === 0 ) { //Measure is completed, add a bar line and reset measureBeatsRemaining
                    if(this.voice1.tickables.length > 0 && !this.voice1.isComplete()){
                        let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                        this.voice1.addTickable(bar);
                    }
                    measureBeatsRemaining = this.measureBeats;
                }; //correct for beats left in the measure....
                let rhy = this.chooseRhythm(measureBeatsRemaining) //Choose a rhythm that fits within the beats remaining 
                let notes = notesFromString(rhy); //build notes from the rhythm string
                let blockTuplets = createTuplets(rhy, notes);
                this.np.tuplets = this.np.tuplets.concat(blockTuplets);
                this.tuplets = this.tuplets.concat(blockTuplets);
                let blockBeats = this.np.notesToBeats(notes, this.quaver);
                
                if(rhy.includes("s") || rhy.includes("e")){
                    this.noteGroups.push(notes);
                }
                
                this.voice1.addTickables(notes);
            }

            if(countsOn){
                this.addCountsToNotes(this.voice1);
            }
            this.voice1Counts = this.createBeatCountsVoice(this.voice1);

            this.noteGroups.forEach((ng)=>{
                this.beamGroups.push(new VF.Beam.generateBeams(ng, {groups: this.beamGrouping}));
            })
            
            this.formatter.joinVoices([this.voice1])
                .joinVoices([this.voice1Counts])
                .formatToStave([this.voice1, this.voice1Counts], this.np.stave, { align_rests: true }); //put the voice on the stave
            
            if(countsOn){
                this.voice1Counts.draw(this.np.context, this.np.stave);
            }
            this.voice1.draw(this.np.context, this.np.stave); //draw the voice

            this.drawBeamGroups(this.beamGroups);
            this.drawTuplets(this.tuplets);
            
            if(this.measureLength > 4){
                while(!this.voice2.isComplete()){ //while the voice is not filled...
                    let measureBeatsRemaining = (this.voice2.totalTicks.value()-this.voice2.ticksUsed.value())/(this.quaverTicks)%(this.measureBeats)  //calculate number of beats left in current measure
                    
                    if (measureBeatsRemaining === 0 ) { //Measure is completed, add a bar line and reset measureBeatsRemaining
                        if(this.voice2.tickables.length > 0 && !this.voice2.isComplete()){
                            let bar = new VF.BarNote(VF.Barline.type.SINGLE);
                            this.voice2.addTickable(bar);
                        }
                        measureBeatsRemaining = this.measureBeats;
                    }; //correct for beats left in the measure....
                    
                    let rhy = this.chooseRhythm(measureBeatsRemaining) //Choose a rhythm that fits within the beats remaining 
                    let notes = notesFromString(rhy); //build notes from the rhythm string
                    let blockTuplets = createTuplets(rhy, notes);
                    this.np.tuplets2 = this.np.tuplets2.concat(blockTuplets);
                    this.tuplets2 = this.tuplets2.concat(blockTuplets);

                    if(rhy.includes("s") || rhy.includes("e")){
                        this.noteGroups2.push(notes);
                    }

                    
                    this.voice2.addTickables(notes); //add the notes to the voice
                }

                if(countsOn){
                    this.addCountsToNotes(this.voice2);
                }

                this.voice2Counts = this.createBeatCountsVoice(this.voice2);
                
                this.noteGroups2.forEach((ng)=>{
                    this.beamGroups2.push(new VF.Beam.generateBeams(ng, {groups: this.beamGrouping}));
                })
                
                this.np.stave2.setContext(this.np.context).draw();
                
                this.formatter.joinVoices([this.voice2])
                    .joinVoices([this.voice2Counts])
                    .formatToStave([this.voice2, this.voice2Counts], this.np.stave2);
                
                if(countsOn){
                    this.voice2Counts.draw(this.np.context, this.np.stave2); 
                }

                this.voice2.draw(this.np.context, this.np.stave2);
                this.drawBeamGroups(this.beamGroups2);     
                this.drawTuplets(this.tuplets2);
            }   
        }
        passageGenerated = true;
    };

    this.addCountsToNotes = function(voice){
        let ticksPerBeat = voice.time.resolution/voice.time.beat_value
        //counting "big beats" in compound time signatures
        ticksPerBeat = ticksPerBeat * (activeLevel.tuplet ? 3 : 1);
        const countStrings = activeLevel.tuplet ? COMPOUND_COUNT_STRINGS : SIMPLE_COUNT_STRINGS;
        let ticksUsed = 0;
        let notes = voice.tickables;
        notes.forEach((n)=>{
            let ticksRemaining = (voice.totalTicks.value()-ticksUsed)
            let beatNumber = ((Math.round((ticksUsed/ticksPerBeat))%this.measureBeats)+1).toFixed(0);
            let remainder = ((ticksRemaining/ticksPerBeat)%1).toFixed(3);
            let countingText = remainder === "0.000" ? "" : countStrings[remainder.toString()]
            if(n.attrs.type === "StaveNote"){ //Skipping BarNotes which can't receive annotations
                if(n.ticks.denominator===3 && remainder==="0.000"){
                    n.addAnnotation(0, new VF.Annotation(beatNumber.toString()).setVerticalJustification(3).setJustification(2),);
                } else {
                    n.addAnnotation(0, new VF.Annotation(countingText).setVerticalJustification(3).setJustification(2),);
                }
                ticksUsed+=n.ticks.value();
            }
        });
    };
    
    this.createBeatCountsVoice = function(noteVoice){
        let countsVoice = new VF.Voice({ num_beats: noteVoice.time.num_beats, beat_value: noteVoice.time.beat_value })
        let ticksPerBeat = noteVoice.time.resolution/noteVoice.time.beat_value
        
        noteVoice.tickables.forEach((t)=>{
            let beatNumber = ((countsVoice.ticksUsed.value()/ticksPerBeat)%this.measureBeats)+1;

            if(t.attrs.type==="BarNote" || t.ticks.denominator===3){
                countsVoice.addTickable(t);
            } else if(t.getCategory()==="stavenotes") {
                let numberOfSmallestDurations = (t.ticks.value()/ticksPerBeat)*(this.smallestDuration/this.quaver)
                for(let i = 0; i < numberOfSmallestDurations; i++){
                    beatNumber = ((countsVoice.ticksUsed.value()/ticksPerBeat)%this.measureBeats)+1;
                    if(activeLevel.tuplet){
                        beatNumber = this.getCompoundBigBeat(beatNumber);
                    }
                    let countText = (countsVoice.totalTicks.value() - countsVoice.ticksUsed.value())%(ticksPerBeat) === 0 ? beatNumber : "";
                    let tn = new Vex.Flow.TextNote({
                        text: countText,
                        font: {
                            family: "Arial",
                            size: 10,
                            weight: ""
                        },
                        duration: this.smallestDuration.toString(),               
                    }).setLine(9)
                    .setStave(this.np.stave)
                    .setJustification(Vex.Flow.TextNote.Justification.CENTER);
                    
                    countsVoice.addTickable(tn)
                }
            }

        })
        return countsVoice;
    };

    this.measureBeatsRemaining = function(){
        const measureRemainder = this.beatsRemaining()%this.measureBeats;
        return  ( measureRemainder === 0 ? this.measureBeats : measureRemainder );
    };

    this.drawBeamGroups = function(beamGroups){
        beamGroups.forEach((bg) => {
            bg.forEach((b)=>{
                b.setContext(this.np.context).draw(); //draw the beams
            })
        });
    };

    this.drawTuplets = function(tuplets){
        tuplets.forEach((t)=>{
            t.setContext(this.np.context).draw();
        })
    };

    this.getCompoundBigBeat = function(beatNumber){
        const beatRemainder = beatNumber%3;
        if(beatRemainder===1){
            return (beatNumber+2)/3
        } else {
            return "";
        }
    };   
};