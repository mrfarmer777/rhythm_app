//VexFlow Boilerplate
const VF = Vex.Flow;

const NOTE_CHARS = ["s","e","q","h","w","S","E","Q","H","W"];
let Levels = [];
let Blocks = [];
let DupBlocks = [];
let FillerBlocks = buildFallbackBlocks(fillerBlockData);

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

    ".": "d",

    "W": "1r",  //Rest Codes
    "H": "2r",
    "Q": "4r",
    "E": "8r",
    "S": "16r",

    "(":"(", //passing through triplet indicators
    ")":")",
    "-":"-", //passing through tie indicators
};



const getTimeSigBeats = function(){
  return activeLevel.measureBeats;
}

const getTimeSigQuaver = function(){
  return activeLevel.quaver;
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
    const tupletedNotes = notes.slice(is[0], is[1]);
    let tuplet = new VF.Tuplet(notes.slice(is[0], is[1]), {num_notes: (tupletedNotes.length === 6 ? 6 : 3), notes_occupied: (tupletedNotes.length === 6 ? 4 : 2), ratioed: false });;
    return tuplet;
  })
  return tuplets;
}

// From a note string, build an array of indeces for creating tuplet objects
const tupletsIndecesFromString = function(noteString){
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
    } else if(NOTE_CHARS.includes(char)) {
      noteCount++; //iterate the note count because a note will be added
    }
  })
  return result;
}

const createTiesFromRhythmString = function(rhythmString, notes){
  const tieIndeces = tieIndicesFromString(rhythmString);
  const ties = tieIndeces.map((ti)=>{
    let tie = new VF.StaveTie({
      first_note: notes[ti],
      last_note:  notes[ti+1]
    });
    return tie;
  })
  return ties;
}

const createTies = function(tieStartIndeces, notes){
  const noteDurations = notes.map((n)=>{ return n.duration })
  const ties = tieStartIndeces.map((tsi)=>{
    let lookAheadIndex = tsi + 1
    const max = notes.length-1;
    while(lookAheadIndex <= max){
      if(notes[lookAheadIndex].attrs.type === "StaveNote"){
        break;
      } else {
        lookAheadIndex++;
      }
    }
    let tie = new VF.StaveTie({
      first_note: notes[tsi],
      last_note:  notes[lookAheadIndex]
    });
    return tie;
  })
  return ties;
}

const tieIndicesFromString = function(rhythmString){
  noteCount = 0;
  let tieStartIndeces = [];
  rhythmString.split('').forEach((char, i)=>{
    if(char === "-"){
      tieStartIndeces.push(noteCount-1);
    } else if(NOTE_CHARS.includes(char)){
      noteCount++;
    }
  })
  return tieStartIndeces;
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

//Changes active level, resets difficulty to A, redraws a blank passage
const changeLevel = function(selectedLevelObject){
  level = selectedLevelObject.name;
  if(activeLevel){
    if(selectedLevelObject.measureBeats !== activeLevel.measureBeats || selectedLevelObject.quaver !== activeLevel.quaver){
      restartNeeded = true;
    }
  }
  activeLevel = selectedLevelObject;
  deselectAllBlocks(Blocks);
  let la = selectedLevelObject.getLevelArray();


  updateAvailableBlocks(la, difficulty);
  let availableLevels = (tupletsOn ? CompoundLevels : SimpleLevels);
  renderLevelButtons(availableLevels, levelButtonTarget, activeLevel.name);
  selectDifficulty(( restsOn ? "a-r": "a"));
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


const selectDifficulty = function(targetDifficulty){
  difficulty = targetDifficulty;
  let diffs = buildDifficulties(getAvailableDifficulties(availableBlocks));
  renderDifficultyButtons(diffs, difficultyButtonTarget, difficulty);
  if(targetDifficulty !== "custom"){
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
    const difficultyBlocks = availableBlocks.filter( (b) => { return b.rhythmSet.includes(d) });
      if(arraysEqual(selectedBlocks, difficultyBlocks)){
        activeDifficulty = d;
      }
  });
  selectDifficulty(activeDifficulty);
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
  let difficultiesUsed = [];
  blocks.forEach((b) => {
    difficultiesUsed = difficultiesUsed.concat(b.rhythmSet);
  });
  let diffSet = new Set(difficultiesUsed);
  return Array.from(diffSet);
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
  selectDifficulty(restsOn ? "a-r" : "a");
  let button = document.getElementById("rests-toggle-button")
  button.className = "control-button item "+(restsOn ? "selected": "")+ (tupletsOn ? " hidden": "");
  button.innerHTML = "Rests";
};

const toggleTuplets = function(){
  tupletsOn = !tupletsOn;
  if(tupletsOn){ restsOn = false };
  let newLevel = getLevel(tupletsOn ? CompoundLevels[0].name: SimpleLevels[0].name)
  changeLevel(newLevel); //change level to current level to force a re-render
  selectDifficulty(restsOn ? "a-r" : "a");
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


// Initialization
let SimpleLevels = [];
let CompoundLevels = [];

const getCompoundLevelNames = function(){
  if(CompoundLevels.length > 0){
    const names = CompoundLevels.map((l)=>{ return l.name })
    return names;
  } else {
    return [];
  }

}

const sortLevels = function(levels){
  let simpleLevels = [];
  let compoundLevels = [];
  levels.forEach((l)=>{
    if(l.tuplet){
      compoundLevels.push(l);
    } else {
      simpleLevels.push(l);
    }
  })
  return [simpleLevels, compoundLevels];
};

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