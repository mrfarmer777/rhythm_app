//Master array of all blocks to be used in the project
const blockData = [

    { level: "q", rhythmSet: "a", noteString: "w" },
    { level: "q", rhythmSet: "a", noteString: "hh" },
    { level: "q", rhythmSet: "a", noteString: "qqqq" },
    { level: "q", rhythmSet: "a", noteString: "hqq" },
    { level: "q", rhythmSet: "a", noteString: "qqh" },
    { level: "q", rhythmSet: "a", noteString: "qhq" },
    { level: "q", rhythmSet: "a", noteString: "qh." },
    { level: "q", rhythmSet: "a", noteString: "h.q" },
    
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
];


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

const selectBlocksByDifficulty = function(rbes, difficulty){
    rbes.forEach((b) => {
        if(b.difficulty<=difficulty){
            b.toggleSelect();
        }
    });
};

const deselectAllBlocks = function(rbes){
    rbes.forEach((b) => {
        b.selected = false;
    });
};


// RhythmBlockElement object definition
const rhythmBlockElement = function(block){
    this.level = block.level;
    this.rhythmSet = block.rhythmSet;
    this.noteString = block.noteString;
    this.selected = false;
    this.toggleSelect = function(e){
        this.selected = !this.selected;
        e.currentTarget.className="item block " + (this.selected ? "selected": "");
    };
    this.handleResize = function(e){
        console.log('called');
        this.np.render();
    }
    this.el = createBlockElement(this);
    this.np = new notationPanel({targetEl: this.el.firstChild.firstChild, panelType: "block"});
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
        targetEl.appendChild(b.el);
    });
    blocksEls.forEach((b)=>{
        b.np.updateNotation(b.noteString);
        b.np.render();
    })
};

const renderBlocks = function(blocksToDisplay){
    let blocksToDraw = blocksToDisplay;
    let target = document.getElementById("blocks-select-container");
    renderBlockElements(blocksToDraw, target);
};

const getSelectedBlocks = function(){
    return Blocks.filter((b)=>{
        return b.selected===true;
    });
};

