//VexFlow Boilerplate
const VF = Vex.Flow;

//Global Blocks, represents all possible rhythm block options
const Blocks = buildRhythmBlocks(blockData);

//Filler blocks used incase a a passageGenerator needs them to fill remaining 
//space in a passage when all available blocks are too large
const FillerBlocks = buildRhythmBlocks(fillerBlockData);

//Initializing MicroModal for introduction flow;
MicroModal.init();

//Target elements to be updated
const levelButtonTarget = document.getElementById("quaver-select-buttons");
const difficultyButtonTarget = document.getElementById("difficulty-select-buttons");

//Level refers to the base beat (quaver) for the rhythm blocks, can be q, e, or s
let level = "q"; 

//Difficulty refers to the level of complexity of selected rhythms
let difficulty = "a";

let restsOn = false;

//The rhythm blocks that are available for selection
let availableBlocks = [];

//Blocks that are activated for inclusion in the passage
let selectedBlocks = [];

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



//A global function for translating strings to arrays of VF Notes
function notesFromString(noteString){
  //Returns an array of VF StaveNotes from a string
  let notes = [];
  noteString.split('').map( (n)=>{
    let dur = durationCharacters[n];
    if(dur==="d"){
      notes[notes.length-1].addDotToAll();
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
// const updateMusic = function(){
//   let noteInput = document.getElementById("note-input");
//   let noteString = noteInput.value;
//   example.clearContext();
//   example.updateNotation(noteString);
//   example.render();
//   renderBlocks();
// };




//let exampleBlocks = Blocks.filter((b)=>{return b.level===1});

//Instantiates the passageGenerator object based on selected blocks
let pg = new passageGenerator(getSelectedBlocks());


//Clears the passage and generates a new one
const generate = function(){
  pg.np.context.clear();
  pg.generate();
};


//Responds to user clicking new level, changes buttons, calls changeLevel
const handleLevelChange = function(){
  let btns = document.querySelectorAll('.level-button');
  btns.forEach((b)=> {
    b.className = "level-button item";
  });
  level = this.event.target.dataset.level;
  this.event.target.className = "level-button item selected";
  changeLevel(level);
};

//Changes active level, resets difficulty to A, redraws a blank passage
const changeLevel = function(selectedLevel){
  level = selectedLevel;
  deselectAllBlocks(Blocks);
  let la = getLevelArray(level);
  updateAvailableBlocks(la, difficulty);
  renderLevelButtons(Levels, levelButtonTarget, selectedLevel);
  changeDifficulty(( restsOn ? "a-r": "a"));
  pg.np.reset();
  pg.np.render();
  
};

//Logic for building level array, more than one level can be selected (i.e. level 4)
const getLevelArray = function(level){
  let levelArray = (level === "4" ? ["q","e","s"] : [level]);
  if(restsOn){
    levelArray.forEach((l) => { levelArray.push(l + "-r") });
  }
  return levelArray;
};

//Adds/Removes available blocks, automatically selects them based upon difficulty and levels
const updateAvailableBlocks = function(levels, selectedDifficulty){
  availableBlocks = filterBlocksByLevels(Blocks, levels);
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, selectedDifficulty);
  selectBlocksByDifficulty(availableBlocks, difficulty);
  renderBlocks(availableBlocks);
};

//Changes activated difficulty and updates difficulty blocks
const changeDifficulty = function(selectedDifficulty){
  if(selectedDifficulty==="custom"){
    difficulty = selectedDifficulty;
    let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
    renderDifficultyButtons(diffs, difficultyButtonTarget, selectedDifficulty);
  } else {
    deselectAllBlocks(Blocks);
    difficulty = selectedDifficulty;
    deselectAllBlocks(Blocks);
    updateAvailableBlocks(getLevelArray(level), difficulty);
    
  }
};

//Checks if a user has (de)activated an available difficulty within the current level
//Updates the difficulty buttons accordingly.
const checkActiveDifficulty = function(){
  let availableDifficulties = getAvailableDifficulties(availableBlocks);
  const selectedBlocks = getSelectedBlocks();
  let activeDifficulty = "custom";
  availableDifficulties.forEach((d) =>{
    const difficultyBlocks = availableBlocks.filter( (b) => { return difficultyLevels.indexOf(b.rhythmSet) <= difficultyLevels.indexOf(d) });
      if(arraysEqual(selectedBlocks, difficultyBlocks)){
        activeDifficulty = d;
      }
  });
  changeDifficulty(activeDifficulty);
};

//Helper function for checking equality of two arrays
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
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

const toggleRests = function(){
  restsOn = !restsOn;
  changeLevel(level); //change level to current level to force a re-render
  changeDifficulty(restsOn ? "a-r" : "a");
};


const debugOutput = function(){
  console.log("Level: "+ level);
  console.log("Difficulty: "+ difficulty);
  console.log("Rests On?: " + restsOn);
  console.log("Available Difficulties: " + availableDifficulties);
}



updateAvailableBlocks(level, difficulty);
pg.np.render();

const Levels = buildLevels(levelData);

renderLevelButtons(Levels, levelButtonTarget, level);
 
//INTRODUCTORY MODAL 
MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]
    openTrigger: 'data-custom-open', // [3]
    closeTrigger: 'data-custom-close', // [4]
    disableScroll: true, // [5]
    disableFocus: false, // [6]
    awaitCloseAnimation: false, // [7]
    debugMode: true // [8]
  });



let introSlideNum = 1;

var continues = document.querySelectorAll(".continue__btn");
continues.forEach((c)=>{ c.addEventListener('click', function(){
  MicroModal.close('modal-'+introSlideNum);
  introSlideNum +=1;
  console.log(introSlideNum);
  if(introSlideNum === 4){
    introSlideNum = 1;
  } else {
    MicroModal.show('modal-'+introSlideNum);
  }
})});

var prevs = document.querySelectorAll(".prev__btn");
prevs.forEach((c)=>{ c.addEventListener('click', function(){
  MicroModal.close('modal-'+introSlideNum);
  if(introSlideNum > 1){
    introSlideNum -=1;
  } else {
    introSlideNum = 1;
  }
  MicroModal.show('modal-'+introSlideNum);

})});

var closes = document.querySelectorAll(".close__btn");
closes.forEach((c)=>{ c.addEventListener('click', function(){
    introSlideNum = 1;
})});


MicroModal.show("intro-modal");

const startIntro = function(){
  MicroModal.close("intro-modal");
  MicroModal.show('modal-1')
}






