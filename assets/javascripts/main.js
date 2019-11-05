//VexFlow Boilerplate
const VF = Vex.Flow;
const Blocks = buildRhythmBlocks(blockData);

//Level refers to the base beat (quaver) for the rhythm blocks, can be q, e, or s
let level = "q"; 

//Difficulty refers to the level of complexity of selected rhythms
let difficulty = 1;

//The rhythm blocks that are available for selection
let availableBlocks = [];


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
      //notes[notes.length-1].duration = notes[notes.length-1].duration+dur;
      notes[notes.length-1].addDotToAll();
      console.log(notes[notes.length-1].duration)
    } else {
      notes.push(new VF.StaveNote({
        clef: "treble",
        keys: ["b/4"],
        duration: dur
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
  updateAvailableBlocks([level], difficulty);
};

const updateAvailableBlocks = function(levels, difficulty){
  availableBlocks = filterBlocksByLevels(Blocks, [level]);
  selectBlocksByDifficulty(availableBlocks, difficulty);
  renderBlocks(availableBlocks);
}

const changeDifficulty = function(selectedDifficulty){
  difficulty = selectedDifficulty;
  updateAvailableBlocks([level], difficulty);
}


const toggleBlockContainer = function(){
  //let el = document.getElementById("blocks-select-container");
  //el.className = (el.className.includes("hidden")) ? "container" : "container hidden";
};

updateAvailableBlocks(level, difficulty);
pg.np.render();






