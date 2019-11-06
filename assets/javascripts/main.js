//VexFlow Boilerplate
const VF = Vex.Flow;
const Blocks = buildRhythmBlocks(blockData);

//Target elements to be updated
const levelButtonTarget = document.getElementById("quaver-select-container");
const difficultyButtonTarget = document.getElementById("level-select-container");

//Level refers to the base beat (quaver) for the rhythm blocks, can be q, e, or s
let level = "q"; 

//Difficulty refers to the level of complexity of selected rhythms
let difficulty = "a";

//The rhythm blocks that are available for selection
let availableBlocks = [];

let availableDifficulties = [];


//Mapping string input characters to VexFlow duration codes
const durationCharacters = {
    "w": "1",   //Note Codes
    "h": "2",
    "q": "4",
    "e": "8",
    "s": "16",
    ".": "d",   //Handling dots locally, calls .addDotsToAll() method
    "W": "1r",  //Rest Codes
    "H": "2r",
    "Q": "4r",
    "E": "8r",
    "S": "16r",
};



function notesFromString(noteString){
  //Returns an array of VF StaveNotes from a string
  let notes = [];
  noteString.split('').map( (n)=>{
    let dur = durationCharacters[n];
    if(dur==="d"){
      notes[notes.length-1].addDotToAll();
      console.log(notes[notes.length-1].duration)
    } else {
      notes.push(new VF.StaveNote({
        clef: "treble",
        keys: ["a/4"],
        duration: dur,
        auto_stem: false,
        stem_direction: 1
      }));
    }
  });
  return notes;
}
  
//Forcing all blocks to draw for development purposes
const updateMusic = function(){
  let noteInput = document.getElementById("note-input");
  let noteString = noteInput.value;
  example.clearContext();
  example.updateNotation(noteString);
  example.render();
  renderBlocks();
};




let exampleBlocks = Blocks.filter((b)=>{return b.level===1});

let pg = new passageGenerator(getSelectedBlocks());

//renderBlocks(Blocks);

const generate = function(){
  pg.np.context.clear();
  pg.generate();
};

const handleLevelChange = function(){
  let btns = document.querySelectorAll('.level-button');
  btns.forEach((b)=> {
    b.className = "level-button item";
  });
  level = this.event.target.dataset.level;
  this.event.target.className = "level-button item selected";
  changeLevel(level);
};

const changeLevel = function(selectedLevel){
  level = selectedLevel;
  let levelArray = (level === "4" ? ["q","e","s"] : [level]);
  updateAvailableBlocks(levelArray, difficulty);
  renderLevelButtons(Levels, levelButtonTarget);
};

const updateAvailableBlocks = function(levels, difficulty){
  availableBlocks = filterBlocksByLevels(Blocks, levels);
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, difficulty);
  selectBlocksByDifficulty(availableBlocks, difficulty);
  renderBlocks(availableBlocks);
};

const changeDifficulty = function(selectedDifficulty){
  deselectAllBlocks(Blocks);
  difficulty = selectedDifficulty;
}

const getAvailableDifficulties = function(blocks){
  let res = [];
  blocks.forEach((b) => {
    if(!res.includes(b.rhythmSet)){
      res.push(b.rhythmSet);
    }
  });
  return res;
};





updateAvailableBlocks(level, difficulty);
pg.np.render();

const Levels = buildLevels(levelData);

renderLevelButtons(Levels, levelButtonTarget, level);
 






