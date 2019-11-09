//VexFlow Boilerplate
const VF = Vex.Flow;
const Blocks = buildRhythmBlocks(blockData);

MicroModal.init();



const FillerBlocks = buildRhythmBlocks(fillerBlockData);

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
  deselectAllBlocks(Blocks);
  let la = getLevelArray(level);
  updateAvailableBlocks(la, difficulty);
  renderLevelButtons(Levels, levelButtonTarget, selectedLevel);
  changeDifficulty(( restsOn ? "a-r": "a"));
  
};

const getLevelArray = function(level){
  let levelArray = (level === "4" ? ["q","e","s"] : [level]);
  if(restsOn){
    levelArray.forEach((l) => { levelArray.push(l + "-r") });
  }
  return levelArray;
};

const updateAvailableBlocks = function(levels, selectedDifficulty){
  availableBlocks = filterBlocksByLevels(Blocks, levels);
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, selectedDifficulty);
  selectBlocksByDifficulty(availableBlocks, difficulty);
  renderBlocks(availableBlocks);
};

const changeDifficulty = function(selectedDifficulty){
  deselectAllBlocks(Blocks);
  difficulty = selectedDifficulty;
  deselectAllBlocks(Blocks);
  updateAvailableBlocks(getLevelArray(level), difficulty);
  
};



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






