//VexFlow Boilerplate
const VF = Vex.Flow;
const Blocks = buildRhythmBlocks(blockData);



const durationCharacters = {
    "w": "1",
    "h": "2",
    "q": "4",
    "e": "8",
    "s": "16"
};

function notesFromString(noteString){
  //Returns an array of VF StaveNotes from a string
  let notes = [];
  noteString.split('').map( (n)=>{
    let dur = durationCharacters[n];
    notes.push(new VF.StaveNote({
      clef: "treble",
      keys: ["b/4"],
      duration: dur
    }));
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

renderBlocks(Blocks);
pg.np.render();

const generate = function(){
  pg.np.context.clear();
  pg.generate();
};


const toggleBlockContainer = function(){
  //let el = document.getElementById("blocks-select-container");
  //el.className = (el.className.includes("hidden")) ? "container" : "container hidden";
}





