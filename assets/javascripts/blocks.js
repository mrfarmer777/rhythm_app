//Master array of all blocks to be used in the project
const blockData = [

    { level: "q", rhythmSet: "a", noteString: "w" },
    { level: "q", rhythmSet: "a", noteString: "hh" },
    { level: "q", rhythmSet: "a", noteString: "qqqq" },
    { level: "q", rhythmSet: "a", noteString: "hqq" },
    { level: "q", rhythmSet: "a", noteString: "qqh" },
    { level: "q", rhythmSet: "a", noteString: "h.q" },
    { level: "q", rhythmSet: "a", noteString: "qh." },
    { level: "q", rhythmSet: "a", noteString: "qhq" },
    
    { level: "e", rhythmSet: "a", noteString: "h" },
    { level: "e", rhythmSet: "a", noteString: "qq" },
    { level: "e", rhythmSet: "a", noteString: "eeee" },
    { level: "e", rhythmSet: "b", noteString: "qee" },
    { level: "e", rhythmSet: "b", noteString: "eeq" },
    { level: "e", rhythmSet: "c", noteString: "q.e" },
    { level: "e", rhythmSet: "c", noteString: "eq." },
    { level: "e", rhythmSet: "d", noteString: "eqe" },
    
    { level: "s", rhythmSet: "a", noteString: "q" },
    { level: "s", rhythmSet: "a", noteString: "ee" },
    { level: "s", rhythmSet: "a", noteString: "ssss" },
    { level: "s", rhythmSet: "b", noteString: "ess" },
    { level: "s", rhythmSet: "c", noteString: "sse" },
    { level: "s", rhythmSet: "d", noteString: "e.s" },
    { level: "s", rhythmSet: "e", noteString: "se." },
    { level: "s", rhythmSet: "f", noteString: "ses" },
    
    { level: "q-r", rhythmSet: "a-r", noteString: "Qqqq" },
    { level: "q-r", rhythmSet: "a-r", noteString: "Qqh" },
    { level: "q-r", rhythmSet: "a-r", noteString: "Qhq" },
    { level: "q-r", rhythmSet: "a-r", noteString: "Hqq" },
    { level: "q-r", rhythmSet: "b-r", noteString: "Qh." },
    { level: "q-r", rhythmSet: "b-r", noteString: "Hh" },
    { level: "q-r", rhythmSet: "b-r", noteString: "H.q" },

    { level: "e-r", rhythmSet: "a-r", noteString: "Eeee" },
    { level: "e-r", rhythmSet: "a-r", noteString: "Eeq" },
    { level: "e-r", rhythmSet: "b-r", noteString: "Eqe" },
    { level: "e-r", rhythmSet: "c-r", noteString: "Qee" },
    { level: "e-r", rhythmSet: "c-r", noteString: "Eq." },
    { level: "e-r", rhythmSet: "d-r", noteString: "Qq" },
    { level: "e-r", rhythmSet: "d-r", noteString: "Q.e" },
    
    { level: "s-r", rhythmSet: "a-r", noteString: "Ssss" },
    { level: "s-r", rhythmSet: "a-r", noteString: "Sse" },
    { level: "s-r", rhythmSet: "b-r", noteString: "Ses" },
    { level: "s-r", rhythmSet: "c-r", noteString: "Ess" },
    { level: "s-r", rhythmSet: "c-r", noteString: "Se." },
    { level: "s-r", rhythmSet: "d-r", noteString: "Ee" },
    { level: "s-r", rhythmSet: "d-r", noteString: "E.s" },
    
    { level: "t", rhythmSet: "a", noteString: "h." },
    { level: "t", rhythmSet: "a", noteString: "q." },
    { level: "t", rhythmSet: "a", noteString: "eee" },
    { level: "t", rhythmSet: "b", noteString: "qe" },
    { level: "t", rhythmSet: "c", noteString: "eq" },
    { level: "t", rhythmSet: "d", noteString: "Eee" },
    { level: "t", rhythmSet: "e", noteString: "Qe" },
    { level: "t", rhythmSet: "f", noteString: "Eq" },

    { level: "u", rhythmSet: "a", noteString: "ssssss" },
    { level: "u", rhythmSet: "a", noteString: "esse" },
    { level: "u", rhythmSet: "b", noteString: "ssee" },
    { level: "u", rhythmSet: "b", noteString: "eess" },
    { level: "u", rhythmSet: "c", noteString: "sssse" },
    { level: "u", rhythmSet: "c", noteString: "essss" },
    { level: "u", rhythmSet: "c", noteString: "ssess" },
    { level: "u", rhythmSet: "d", noteString: "e.se" },
    { level: "u", rhythmSet: "d", noteString: "ee.s" },
    { level: "u", rhythmSet: "e", noteString: "e.sss" },
    { level: "u", rhythmSet: "e", noteString: "ssse." },

    
    
];


const dupBlockData = [
    { level: "u", rhythmSet: "a", noteString: "q." },
    { level: "u", rhythmSet: "a", noteString: "eee" },
    ]


//Set of blocks to fill out empty passage beats when no other rhythms are selected
const fillerBlockData = [
    { level: "fill", rhythmSet: "fill", noteString: "h." },
    { level: "fill", rhythmSet: "fill", noteString: "h" },
    { level: "fill", rhythmSet: "fill", noteString: "q" },
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

const filterBlocksByLevels=function(rbes, levelArray){
    if(levelArray===[]){
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
        let notes = notesFromString(b.noteString);
        let totalTicks = 0;
        notes.forEach((n)=> { totalTicks+=n.ticks.value() })
        return totalTicks <= ticks;
    });
};

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
        this.el.className = "item block";
        this.np.updateNotation(this.noteString);
        this.np.render();
    };
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
    });
    blocksEls.forEach((b)=>{
        b.np.updateNotation(b.noteString);
        b.np.render();
        b.beatLength = b.np.beatLength();
        
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

