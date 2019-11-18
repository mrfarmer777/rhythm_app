//VexFlow Boilerplate
const VF = Vex.Flow;

//Global Blocks, represents all possible rhythm block options
const Blocks = buildRhythmBlocks(blockData);

const DupBlocks = buildRhythmBlocks(dupBlockData);

//Filler blocks used incase a a passageGenerator needs them to fill remaining 
//space in a passage when all available blocks are too large
const FillerBlocks = buildRhythmBlocks(fillerBlockData);

//Initializing MicroModal for introduction flow;
MicroModal.init();

//Target elements to be updated
const levelButtonTarget = document.getElementById("quaver-select-buttons");
const difficultyButtonTarget = document.getElementById("difficulty-select-buttons");
const blockContainerTarget = document.getElementById("blocks-select-container");

//Level refers to the base beat (quaver) for the rhythm blocks, can be q, e, or s
let level = "q"; 

//Difficulty refers to the level of complexity of selected rhythms
let difficulty = "a";

let restsOn = false;

let tupletsOn = false;

//The rhythm blocks that are available for selection
let availableBlocks = [];

//Blocks that are activated for inclusion in the passage
let selectedBlocks = [];

//Difficulties that are available based upon the currently-selected level
let availableDifficulties = [];


//Mapping string input characters to VexFlow duration codes
const durationCharacters = {
    "w": "1",   //Note Codes
    "h": "2",
    "q": "4",
    "e": "8",
    "s": "16",
    
    ".": "d",   //IDEA: STill use the dot, but pop the last note out of the array, build a new one and put it back in! 
    "": "2",   //Handling dots locally, calls .addDotsToAll() method
    "$": "4",
    "*": "8",
    "^": "16",
    
    "W": "1r",  //Rest Codes
    "H": "2r",
    "Q": "4r",
    "E": "8r",
    "S": "16r",
    
    "Y": "3/4", //hard coding dotted rhythm durations?
};

const levelTimeSignatures = {
  "q": {"beats": 4, "quaver" : 4 }, 
  "e": {"beats": 4, "quaver" : 4 }, 
  "s": {"beats": 2, "quaver" : 4 }, 
  "4": {"beats": 4, "quaver" : 4 }, 
  "t": {"beats": 6, "quaver" : 8 }, 
}

const getTimeSigBeats = function(){
  return levelTimeSignatures[level].beats;
}

const getTimeSigQuaver = function(){
  return levelTimeSignatures[level].quaver;
}




//A global function for translating strings to arrays of VF Notes
function notesFromString(noteString){
  //Returns an array of VF StaveNotes from a string
  let notes = [];
  noteString.split('').map( (n,i)=>{
    let dur = durationCharacters[n];
    if(dur ==="d"){
      notes.pop();
      let prevDur = durationCharacters[noteString.split('')[i-1]];
      let sn = new VF.StaveNote({
        clef: "treble",
        keys: ["a/4"],
        duration: prevDur,
        auto_stem: false,
        stem_direction: 1
      }).addDotToAll();
      sn.setIntrinsicTicks(sn.ticks.value()*1.5);
      notes.push(sn);
      
      
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
  let availableLevels = (tupletsOn ? CompoundLevels : SimpleLevels)
  renderLevelButtons(availableLevels, levelButtonTarget, selectedLevel);
  changeDifficulty(( restsOn ? "a-r": "a"));
  pg.np.reset();
  pg.np.render();
  
};

//Logic for building level array, more than one level can be selected (i.e. level 4)
const getLevelArray = function(level){
  let levelArray;
  if(level==="4"){
    levelArray = ["q", "e", "s"];
  } else if(level ==="8"){
    levelArray = ["t", "u"];
  } else {
    levelArray = [level];
  }
    
  if(restsOn && !tupletsOn){
    levelArray.forEach((l) => { levelArray.push(l + "-r") });
  }
  return levelArray;
};

//Adds/Removes available blocks, automatically selects them based upon difficulty and levels
const updateAvailableBlocks = function(levels, selectedDifficulty){
  blockContainerTarget.innerHTML = "";
  availableBlocks = filterBlocksByLevels(Blocks, levels);
  
  if(level==="8") {
    console.log("yup")
    let removeLevel = "u";
    let removeStrings = ["q.","eee"]
    availableBlocks = availableBlocks.filter((b)=>{
      return (!removeStrings.includes(b.noteString) || b.level==="t");
    });
    
  } //Added to accommodate adding a duplicate rhythm to this level that shouldn't be added otherwise
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, selectedDifficulty);
  selectBlocksByDifficulty(availableBlocks, difficulty);
  
  levels.forEach((l)=>{
    let levelBlocks = filterBlocksByLevels(availableBlocks, l)
    renderBlocks(levelBlocks);
  })
};

const clearBlocks = function(){
  blockContainerTarget.innerHTML="";
}





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
  let button = document.getElementById("rests-toggle-button")
  button.className = "control-button item "+(restsOn ? "selected": "")+ (tupletsOn ? " hidden": "");
  button.innerHTML = "Rests: "+(restsOn ? "On" : "Off");
};

const toggleTuplets = function(){
  tupletsOn = !tupletsOn;
  if(tupletsOn){ restsOn = false };
  changeLevel(tupletsOn ? "t" : "q"); //change level to current level to force a re-render
  changeDifficulty(restsOn ? "a-r" : "a");
  let button = document.getElementById("tuplets-toggle-button")
  button.className = "control-button item "+(tupletsOn ? "selected": "");
  let restsButton = document.getElementById("rests-toggle-button")
  restsButton.className = "control-button item "+(restsOn ? "selected": "")+ (tupletsOn ? " hidden": "");


  
  renderLevelButtons((tupletsOn ? CompoundLevels : SimpleLevels), levelButtonTarget, level);
};




//Initialization
updateAvailableBlocks([level], difficulty);
pg.np.reset();
pg.np.render();

const Levels = buildLevels(levelData);

const SimpleLevels = Levels.filter((l) => {  return !l.tuplet; })

const CompoundLevels = Levels.filter((l)=>{ return l.tuplet })

renderLevelButtons(SimpleLevels, levelButtonTarget, level);
 
 
const resizeNotation = function(){
  console.log('called');
  pg.np.render();
  availableBlocks.forEach((b)=>{
    console.log("resize block: " + b.id);
    b.np.render();
  });
};
 

window.addEventListener('resize', resizeNotation);


 
 
 
 
 
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

//Intro modal disabled
//MicroModal.show("intro-modal");

const startIntro = function(){
  //MicroModal.close("intro-modal");
  MicroModal.show('modal-1')
};


const deselectAll = function(){
  deselectAllBlocks(Blocks);
  clearBlocks();

  let levels = getLevelArray(level);
  
  levels.forEach((l)=>{
    let levelBlocks = filterBlocksByLevels(availableBlocks, l)
    renderBlocks(levelBlocks);
  })
  checkActiveDifficulty();
};

const selectAll = function(){
  selectAllBlocks(availableBlocks);
  clearBlocks();
  let levels = getLevelArray(level);
  
  levels.forEach((l)=>{
    let levelBlocks = filterBlocksByLevels(availableBlocks, l)
    renderBlocks(levelBlocks);
  })
  checkActiveDifficulty();
};






