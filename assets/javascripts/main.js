//VexFlow Boilerplate
VF = Vex.Flow;


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
  


const updateMusic = function(){
  let noteInput = document.getElementById("note-input");
  let noteString = noteInput.value;
  example.clearContext();
  example.updateNotation(noteString);
  example.render();
  renderBlocks();
};

