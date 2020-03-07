function RhythmValidatorService(){
    /**
     * [Returns true if the rhythmBlock is smaller than a measure in the level provided]
     */
    this.validateRhythm = function(rhythmBlock, level){
        const beats = parseInt(level.measureBeats);
        const quaver = level.quaver;
        const blockBeats = rhythmBlock.beatLength;

        return blockBeats <=beats; 
    }
}