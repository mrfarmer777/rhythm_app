//VexFlow Boilerplate
const VF = Vex.Flow;

const Levels = buildLevels();


//Global Blocks, represents all possible rhythm block options
const Blocks = buildRhythmBlocks(blockData);

const DupBlocks = buildRhythmBlocks(dupBlockData);

//Filler blocks used incase a a passageGenerator needs them to fill remaining
//space in a passage when all available blocks are too large
const FillerBlocks = buildRhythmBlocks(fillerBlockData);




//Initializing MicroModal for introduction flow;
MicroModal.init();

//Custom level retrieval
getCustomRhythms();

//Target elements to be updated
const levelButtonTarget = document.getElementById("quaver-select-buttons");
const customLevelButtonTarget = document.getElementById("custom-level-select-buttons");
const difficultyButtonTarget = document.getElementById("difficulty-select-buttons");
const blockContainerTarget = document.getElementById("blocks-select-container");

//Level refers to the base beat (quaver) for the rhythm blocks, can be q, e, or s
let level = "1";
let activeLevel;

//Difficulty refers to the level of complexity of selected rhythms
let difficulty = "a";

let restsOn = false;

let tupletsOn = false;

let countsOn = false;

let passageGenerated=false;

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
    // "": "2",   //Handling dots locally, calls .addDotsToAll() method
    // "$": "4",
    // "*": "8",
    // "^": "16",

    "W": "1r",  //Rest Codes
    "H": "2r",
    "Q": "4r",
    "E": "8r",
    "S": "16r",

    "Y": "3/4", //hard coding dotted rhythm durations?

    "(":"(", //passing through triplet indicators
    ")":")",
    "-":"-", //passing through tie indicators
};



const getTimeSigBeats = function(){
  return activeLevel.measureBeats;
  //return levelTimeSignatures[level].beats;
}

const getTimeSigQuaver = function(){
  return activeLevel.quaver;
  //return levelTimeSignatures[level].quaver;
}




//A global function for translating strings to arrays of VF Notes
function notesFromString(noteString){
  //Returns an array of VF StaveNotes from a string
  let notes = [];
  let tickMultiplier = 1; //a multiplier used for triplets and dots
  noteString.split('').map( (n,i)=>{
    let dur = durationCharacters[n];
    if(dur ==="d"){
      notes.pop();
      let prevDur = durationCharacters[noteString.split('')[i-1]];
      let sn = new VF.StaveNote({
        clef: "treble",
        keys: ["a/4"],
        duration: (prevDur.includes("r") ? prevDur[0] + "d" + prevDur[1] : prevDur+"d"),
        auto_stem: false,
        stem_direction: 1
      });
      sn.addModifier(0, new Vex.Flow.Dot())
      //sn.setIntrinsicTicks(sn.ticks.value()*1.5);
      notes.push(sn);
    } else if(dur === "(" ) {
      tickMultiplier = 1;
    } else if(dur === ")"){
      tickMultiplier = 1;
    } else if(dur === "-"){
      tickMultiplier = 1;
    } else {
      sn = new VF.StaveNote({
        clef: "treble",
        keys: ["a/4"],
        duration: dur,
        auto_stem: false,
        stem_direction: 1
      })
      sn.setIntrinsicTicks(sn.ticks.value()*tickMultiplier)
      notes.push(sn);
    }
  });
  return notes;
}


const createTuplets = function(rhythmString, notes){
  let tupletIndeces = tupletsIndecesFromString(rhythmString);
  let tuplets = tupletIndeces.map((is) => {
    // let tupletedNotes = np.notes.slice(is[0], is[1]);
    // tupletedNotes.forEach((n)=> n.setIntrinsicTicks(n.ticks.value()*0.667))
    const tupletedNotes = notes.slice(is[0], is[1]);
    let tuplet = new VF.Tuplet(notes.slice(is[0], is[1]), {num_notes: (tupletedNotes.length === 6 ? 6 : 3), notes_occupied: (tupletedNotes.length === 6 ? 4 : 2), ratioed: false });;
    return tuplet;
  })
  return tuplets;
}

// From a note string, build an array of indeces for creating tuplet objects
const tupletsIndecesFromString = function(noteString){
  const noteChars = ["s","e","q","h","w","S","E","Q","H","W"]
  let result = [];
  let noteCount = 0;
  let tupletStartStopIndeces = [];
  noteString.split('').forEach((char, i)=> {
    if(char === "("){
      tupletStartStopIndeces.push(noteCount);

    } else if(char === ")"){
      tupletStartStopIndeces.push(noteCount);
      result.push(tupletStartStopIndeces); 
      tupletStartStopIndeces = []; //clear out the start/stop indeces
    } else if(noteChars.includes(char)) { 
      noteCount++; //iterate the note count because a note will be added
    }
  })  
  return result;
}

const createTies = function(rhythmString, notes){
  const tieIndeces = tieIndicesFromString(rhythmString, notes);
  const ties = tieIndeces.map((ti)=>{
    let tie = new VF.StaveTie({
      first_note: notes[ti[0]],
      last_note:  notes[ti[1]]
    });
    return tie;
  })
  return ties;
}

const tieIndicesFromString = function(rhythmString){
  const noteChars = ["s","e","q","h","w","S","E","Q","H","W"]
  noteCount = 0;
  let tieStartStopIndeces = [];
  rhythmString.split('').forEach((char, i)=>{
    if(char === "-"){
      tieStartStopIndeces.push([noteCount-1, noteCount]);
    } else if(noteChars.includes(char)){
      noteCount++;
    }
  })
  return tieStartStopIndeces;
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



//Instantiates the passageGenerator object based on selected blocks
let pg = new passageGenerator(getSelectedBlocks());


//Clears the passage and generates a new one
const generate = function(){
  pg.np.context.clear();
  pg.generate();
};


//Responds to user clicking new level, changes buttons, calls changeLevel
// const handleLevelChange = function(){
//   let btns = document.querySelectorAll('.level-button');
//   btns.forEach((b)=> {
//     b.className = "level-button item";
//   });
//   level = this.event.target.dataset.level;
//   selectedLevelObject = getLevel(level);
//   this.event.target.className = "level-button item selected";
//   changeLevel(selectedLevelObject);
// };

//Changes active level, resets difficulty to A, redraws a blank passage
//REFACTORED to take in the level object itself.
const changeLevel = function(selectedLevelObject){
  level = selectedLevelObject.name;
  activeLevel = selectedLevelObject;
  deselectAllBlocks(Blocks);
  let la = selectedLevelObject.getLevelArray();


  updateAvailableBlocks(la, difficulty);
  let availableLevels = (tupletsOn ? CompoundLevels : SimpleLevels);
  renderLevelButtons(availableLevels, levelButtonTarget, activeLevel.name);
  changeDifficulty(( restsOn ? "a-r": "a"));
  pg.refresh();
  pg.np.reset();
  pg.np.render();
};


//Adds/Removes available blocks, automatically selects them based upon difficulty and levels
const updateAvailableBlocks = function(levels, selectedDifficulty){
  blockContainerTarget.innerHTML = "";
  availableBlocks = filterBlocksByLevels(Blocks, levels);
  
  //Added to accommodate adding a duplicate rhythm to this level that shouldn't be added otherwise
  if(level==="8") {
    let removeLevel = "6";
    let removeStrings = ["q.","eee"]
    availableBlocks = availableBlocks.filter((b)=>{
      return (!removeStrings.includes(b.noteString) || b.level==="5");
    });
  } 
  
  //Getting and rendering difficulty buttons and selecting blocks in that difficulty
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, selectedDifficulty);
  if(difficulty !== "custom"){
    selectBlocksByDifficulty(availableBlocks, difficulty);
  }
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
  difficulty = selectedDifficulty;
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, difficulty);
  if(selectedDifficulty !== "custom"){
    updateAvailableBlocks(activeLevel.getLevelArray(), difficulty);
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
  level = (restsOn ? level + "-r": level.replace("-r",""))
  activeLevel = getLevel(level);

  //If no "rest level" is available, go back to level 1 and log it
  if(activeLevel===undefined){
    console.warn("No corresponding rest level was found. Defaulting to first level")
    level = restsOn ? "1-r": "1";
    activeLevel = getLevel(level);
  }
  changeLevel(activeLevel); //change level to current level to force a re-render
  changeDifficulty(restsOn ? "a-r" : "a");
  let button = document.getElementById("rests-toggle-button")
  button.className = "control-button item "+(restsOn ? "selected": "")+ (tupletsOn ? " hidden": "");
  button.innerHTML = "Rests";
};

const toggleTuplets = function(){
  tupletsOn = !tupletsOn;
  if(tupletsOn){ restsOn = false };
  let newLevel = getLevel(tupletsOn ? "5" : "1")
  changeLevel(newLevel); //change level to current level to force a re-render
  changeDifficulty(restsOn ? "a-r" : "a");
  let button = document.getElementById("tuplets-toggle-button")
  button.className = "control-button item "+(tupletsOn ? "selected": "");
  let restsButton = document.getElementById("rests-toggle-button");
  restsButton.className = "control-button item "+(restsOn ? "selected": "")+ (tupletsOn ? " hidden": "");



  renderLevelButtons((tupletsOn ? CompoundLevels : SimpleLevels), levelButtonTarget, level);
};

const toggleCounts = function(){
  countsOn = !countsOn;
  
  if(passageGenerated){
    if(countsOn){
      pg.showCounts();
    } else {
      pg.removeCounts();
    }  
    pg.redraw();
  }
  
  
  
  const button = document.getElementById("counts-toggle-button");
  button.className = "control-button item "+ (countsOn ? "selected" : "");
  button.innerHTML = "Counts";
}




//Initialization
activeLevel = getLevel(level);
 
const SimpleLevels = Levels.filter((l) => {  return l.tuplet===false });
const CompoundLevels = Levels.filter((l) => { return l.tuplet===true });

const getCompoundLevelNames = function(){
  const names = CompoundLevels.map((l)=>{ return l.name })
  return names;
}

// Updating FillerBlocks so their lengths are properly filtered
// These blocks don't otherwise get rendered, so they won't be updated
FillerBlocks.forEach( (b) => { b.np.updateNotation(b.noteString) });

updateAvailableBlocks([level], difficulty);
pg.np.reset();
pg.np.render();

renderLevelButtons(SimpleLevels, levelButtonTarget, level);


//Handling Resizing
const resizeNotation = function(){
  pg.np.render();
  availableBlocks.forEach((b)=>{
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

  let levels = activeLevel.getLevelArray();

  levels.forEach((l)=>{
    let levelBlocks = filterBlocksByLevels(availableBlocks, l)
    renderBlocks(levelBlocks);
  })
  checkActiveDifficulty();
};

const selectAll = function(){
  selectAllBlocks(availableBlocks);
  clearBlocks();
  let levels = activeLevel.getLevelArray();

  levels.forEach((l)=>{
    let levelBlocks = filterBlocksByLevels(availableBlocks, l)
    renderBlocks(levelBlocks);
  })
  checkActiveDifficulty();
};

const toggleShareSettings = function(){
  let shareModal = document.querySelector("#share-link");
  let baseUrl = window.location.href.split("?")[0];
  let blockString = getSelectedBlocks().map(b=>{ return b.noteString}).join(",")
  let paramString = `${baseUrl}?level=${level}&blocks=${blockString}`
  shareModal.setAttribute("value",paramString);
  MicroModal.show('share-modal');
  shareModal.select();
}

const copyLink = function(){
  let shareModal = document.querySelector("#share-link");
  shareModal.select();
  document.execCommand('copy');
  MicroModal.close('share-modal');
  Toastify({
    text: "Settings copied to clipboard",
    duration: 3000,
    gravity: "bottom",
  }).showToast();

}





