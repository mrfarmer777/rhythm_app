//Master array of all blocks to be used in the project
const blockData = [

    { level: "1", rhythmSet: "a", noteString: "w" },
    { level: "1", rhythmSet: "a", noteString: "hh" },
    { level: "1", rhythmSet: "a", noteString: "qqqq" },
    { level: "1", rhythmSet: "a", noteString: "hqq" },
    { level: "1", rhythmSet: "a", noteString: "qqh" },
    { level: "1", rhythmSet: "a", noteString: "h.q" },
    { level: "1", rhythmSet: "a", noteString: "qh." },
    { level: "1", rhythmSet: "a", noteString: "qhq" },

    { level: "2", rhythmSet: "a", noteString: "h" },
    { level: "2", rhythmSet: "a", noteString: "qq" },
    { level: "2", rhythmSet: "a", noteString: "eeee" },
    { level: "2", rhythmSet: "b", noteString: "qee" },
    { level: "2", rhythmSet: "b", noteString: "eeq" },
    { level: "2", rhythmSet: "c", noteString: "q.e" },
    { level: "2", rhythmSet: "c", noteString: "eq." },
    { level: "2", rhythmSet: "d", noteString: "eqe" },

    { level: "3", rhythmSet: "a", noteString: "q" },
    { level: "3", rhythmSet: "a", noteString: "ee" },
    { level: "3", rhythmSet: "a", noteString: "ssss" },
    { level: "3", rhythmSet: "b", noteString: "ess" },
    { level: "3", rhythmSet: "c", noteString: "sse" },
    { level: "3", rhythmSet: "d", noteString: "e.s" },
    { level: "3", rhythmSet: "e", noteString: "se." },
    { level: "3", rhythmSet: "f", noteString: "ses" },

    { level: "1-r", rhythmSet: "a-r", noteString: "Qqqq" },
    { level: "1-r", rhythmSet: "a-r", noteString: "Qqh" },
    { level: "1-r", rhythmSet: "a-r", noteString: "Qhq" },
    { level: "1-r", rhythmSet: "a-r", noteString: "Hqq" },
    { level: "1-r", rhythmSet: "b-r", noteString: "Qh." },
    { level: "1-r", rhythmSet: "b-r", noteString: "Hh" },
    { level: "1-r", rhythmSet: "b-r", noteString: "H.q" },

    { level: "2-r", rhythmSet: "a-r", noteString: "Eeee" },
    { level: "2-r", rhythmSet: "a-r", noteString: "Eeq" },
    { level: "2-r", rhythmSet: "b-r", noteString: "Eqe" },
    { level: "2-r", rhythmSet: "c-r", noteString: "Qee" },
    { level: "2-r", rhythmSet: "c-r", noteString: "Eq." },
    { level: "2-r", rhythmSet: "d-r", noteString: "Qq" },
    { level: "2-r", rhythmSet: "d-r", noteString: "Q.e" },

    { level: "3-r", rhythmSet: "a-r", noteString: "Ssss" },
    { level: "3-r", rhythmSet: "a-r", noteString: "Sse" },
    { level: "3-r", rhythmSet: "b-r", noteString: "Ses" },
    { level: "3-r", rhythmSet: "c-r", noteString: "Ess" },
    { level: "3-r", rhythmSet: "c-r", noteString: "Se." },
    { level: "3-r", rhythmSet: "d-r", noteString: "Ee" },
    { level: "3-r", rhythmSet: "d-r", noteString: "E.s" },

    { level: "5", rhythmSet: "a", noteString: "h." },
    { level: "5", rhythmSet: "a", noteString: "q." },
    { level: "5", rhythmSet: "a", noteString: "eee" },
    { level: "5", rhythmSet: "b", noteString: "qe" },
    { level: "5", rhythmSet: "c", noteString: "eq" },
    { level: "5", rhythmSet: "d", noteString: "Eee" },
    { level: "5", rhythmSet: "e", noteString: "Qe" },
    { level: "5", rhythmSet: "f", noteString: "Eq" },

    { level: "6", rhythmSet: "a", noteString: "q." },
    { level: "6", rhythmSet: "a", noteString: "eee" },
    { level: "6", rhythmSet: "a", noteString: "ssssss" },
    { level: "6", rhythmSet: "a", noteString: "esse" },
    { level: "6", rhythmSet: "b", noteString: "ssee" },
    { level: "6", rhythmSet: "b", noteString: "eess" },
    { level: "6", rhythmSet: "c", noteString: "sssse" },
    { level: "6", rhythmSet: "c", noteString: "essss" },
    { level: "6", rhythmSet: "c", noteString: "ssess" },
    { level: "6", rhythmSet: "d", noteString: "e.se" },
    { level: "6", rhythmSet: "d", noteString: "ee.s" },
    { level: "6", rhythmSet: "e", noteString: "e.sss" },
    { level: "6", rhythmSet: "e", noteString: "ssse." },

    { level: "7", rhythmSet: "a", noteString: "h." },
    { level: "7", rhythmSet: "a", noteString: "q." },
    { level: "7", rhythmSet: "a", noteString: "eee" },
    { level: "7", rhythmSet: "a", noteString: "qe" },
    { level: "7", rhythmSet: "a", noteString: "eq" },
    { level: "7", rhythmSet: "a", noteString: "e.se" },
    { level: "7", rhythmSet: "a", noteString: "esse" },
    { level: "7", rhythmSet: "a", noteString: "ssssss" },
    { level: "7", rhythmSet: "b", noteString: "ssee" },
    { level: "7", rhythmSet: "b", noteString: "eess" },
    { level: "7", rhythmSet: "c", noteString: "ee.s" },
    { level: "7", rhythmSet: "c", noteString: "Eee" },
    { level: "7", rhythmSet: "d", noteString: "Qe" },
    { level: "7", rhythmSet: "d", noteString: "sssse" },
    { level: "7", rhythmSet: "d", noteString: "essss" },
    { level: "7", rhythmSet: "e", noteString: "ssess" },
    { level: "7", rhythmSet: "e", noteString: "Eq" },
    { level: "7", rhythmSet: "f", noteString: "e.sss" },
    { level: "7", rhythmSet: "f", noteString: "ssse." },
];


const dupBlockData = [
    { level: "6", rhythmSet: "a", noteString: "q." },
    { level: "6", rhythmSet: "a", noteString: "eee" },
    ]


//Set of blocks to fill out empty passage beats when no other rhythms are selected
const fillerBlockData = [
    { level: "fill", rhythmSet: "fill", noteString: "h." },
    { level: "fill", rhythmSet: "fill", noteString: "h" },
    { level: "fill", rhythmSet: "fill", noteString: "q." },
    { level: "fill", rhythmSet: "fill", noteString: "q" },
    { level: "fill", rhythmSet: "fill", noteString: "e." },
    { level: "fill", rhythmSet: "fill", noteString: "e" },
    { level: "fill", rhythmSet: "fill", noteString: "s" },
    ];


const difficultyLevels = ["a", "b", "c", "d", "e", "f", "a-r", "b-r", "c-r", "d-r", "e-r"];



//REFACTOR filter function
const filterBlocks=function(options){
    if(options === {} ){
        return blockData;
    } else {
        return blockData.filter((b)=>{
            return (b.level==options.level);
        });
    }
};

const findBlockByNoteString = function(rbes, noteString){
    return rbes.filter((b)=>{
        return b.noteString === noteString;
    })
}

const filterBlocksByLevels=function(rbes, levelArray){
    if(levelArray.length===0){
        return rbes;
    } else {
        return rbes.filter((b) => {
            return (levelArray.includes(b.level));
        });
    };
};

const filterBlocksByBeatLength = function(rbes, beats){
    return rbes.filter((b) => {
        return b.beatLength <= beats;
    });
};


const filterBlocksByTicks = function(rbes, ticks) {
    return rbes.filter((b)=>{
        // let notes = notesFromString(b.noteString);
        // let totalTicks = 0;
        // notes.forEach((n)=> { totalTicks+=n.ticks.value() })

        return b.np.totalTicks() <= ticks;
    });
};

const findBlockByTicks = function(rbes, ticks){
    return rbes.find( (b) => {
        return b.np.totalTicks() === ticks;
    })
}

const batchSelectBlocks = function(rbes, rhythmStringArray){
    rbes.forEach((b)=>{
        b.selected = false;
        if(rhythmStringArray.includes(b.noteString)){
            b.selected = true;
        }
    })
}

const selectBlocksByDifficulty = function(rbes, difficulty){
    rbes.forEach((b) => {
        b.selected = false;
        if(difficultyLevels.indexOf(b.rhythmSet) <= difficultyLevels.indexOf(difficulty)){
            b.selected = true;
        }
    });
};

const deselectAllBlocks = function(rbes){
    rbes.forEach((b) => {
        b.selected = false;
    });
};

const selectAllBlocks = function(rbes){
    rbes.forEach((b)=> {
        b.selected = true;
    });
};


// RhythmBlockElement object definition
//TODO Rename class to something like Block
const rhythmBlockElement = function(block){
    this.level = block.level;
    this.rhythmSet = block.rhythmSet;
    this.noteString = block.noteString;
    //this.notes = notesFromString(this.noteString);
    this.beatLength;
    this.selected = false;
    this.toggleSelect = function(e){
        this.selected = !this.selected;
        e.currentTarget.className="item block " + (this.selected ? "selected": "");
        checkActiveDifficulty();
    };
    this.handleResize = function(e){
        this.np.render();
    };
    this.el = createBlockElement(this);
    this.np = new notationPanel({targetEl: this.el.firstChild.firstChild, panelType: "block", timeSigBeats: 4, timeSigQuaver: 4});
    
    this.render = function(){
        const l = getLevel(this.level);
        this.np.updateTimeSignature(this.beatLength,l.quaver);
        this.el.className = "item block";
        this.np.updateNotation(this.noteString);
        this.np.render();
    };
    this.errors = []
    this.isValid = function(){
        if(!this.noteStringValid()){
            this.errors.push("The note string contains invalid characters.");
        }
        if(this.noteString.length === 0){
            this.errors.push("The note string cannot be blank");
        }
        const levelObj = getLevel(this.level); 
        if(this.beatLength > levelObj.measureBeats){
            this.errors.push("The note string is too long to fit in a single measure at this level.");
        }
        let beatsRemaining = levelObj.measureBeats - this.beatLength;
        if(levelObj.compound){
            beatsRemaining = (levelObj.measureBeats - this.beatLength)/3;
        }
        if(beatsRemaining > 0 && beatsRemaining%1 > 0.001 ){
            console.log(beatsRemaining%1);
            this.errors.push("The note string includes partial beats.")
        }
        return this.errors.length === 0        
    }

    this.noteStringValid = function(){
        return this.noteString.match(/[^wWhHqQeEsS.()]+/)===null
    }
};

//Builds HTML for a block element
const createBlockElement = function(block){
    let el = document.createElement("div");
    let canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";
    let canvas = document.createElement("canvas");
    canvasContainer.appendChild(canvas);
    el.appendChild(canvasContainer);
    el.className = "item block" + (block.selected ? "selected": "");
    el.setAttribute("data-level",block.level);
    el.setAttribute("data-rhythmset",block.rhythmSet);
    el.setAttribute("id", block.noteString);
    el.onclick = block.toggleSelect.bind(block);
    el.onresize = block.handleResize.bind(block);
    return el;
};

//Builds all possible rhythm blocks, should only need to be called once
const buildRhythmBlocks = function(blocks){
    let res = [];
    blocks.forEach((b) => {
        let rbe = new rhythmBlockElement(b);
        res.push(rbe);
    });
    return res;
};

const renderBlockElements = function(blocksEls,targetEl){
    targetEl.innerHTML = "";
    blocksEls.forEach((b)=>{
        b.el.className = "item block " +(b.selected ? "selected":"");
        targetEl.appendChild(b.el);
        b.np.updateNotation(b.noteString);
        b.beatLength = b.np.beatLength();
        b.np.render();
        b.np.render();
    });
};

const renderBlocks = function(blocksToDisplay){
    let blocksToDraw = blocksToDisplay;
    let target = document.getElementById("blocks-select-container");
    let blockSubsetContainer = document.createElement("div");
    blockSubsetContainer.className = "container item block-subset-container";
    target.appendChild(blockSubsetContainer);
    renderBlockElements(blocksToDraw, blockSubsetContainer);
};

const getSelectedBlocks = function(){
    return Blocks.filter((b)=>{
        return b.selected===true;
    });
};

