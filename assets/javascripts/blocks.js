//Master array of all blocks to be used in the project
const blockData = [
    { level: 1, rhythmSet: "A", noteString: "w" },
    { level: 1, rhythmSet: "A", noteString: "hh" },
    { level: 1, rhythmSet: "A", noteString: "qqqq" },
    { level: 1, rhythmSet: "A", noteString: "qqh" },
    { level: 1, rhythmSet: "A", noteString: "hqq" },
    { level: 2, rhythmSet: "B", noteString: "qhq" },
    ];


//REFACTOR filter function
const filterBlocks=function(options){
    if(options === {} ){
        return blockData;
    } else {
        return blockData.filter((b)=>{
            return (b.level==options.level && b.rhythmSet==options.rhythmSet);
        });
    }
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
    this.el = createBlockElement(this);
    this.np = new notationPanel({targetEl: this.el.firstChild.firstChild});
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

