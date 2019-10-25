//Master array of all blocks to be used in the project
const blockArray = [
    { level: 1, rhythmSet: "A", noteString: "w" },
    { level: 1, rhythmSet: "A", noteString: "hh" },
    { level: 1, rhythmSet: "A", noteString: "qqqq" },
    { level: 1, rhythmSet: "A", noteString: "qqh" },
    { level: 2, rhythmSet: "A", noteString: "hqq" },
    { level: 2, rhythmSet: "B", noteString: "qhq" },
    ];
    
const filterBlocks=function(options){
    if(options === {} ){
        return blockArray;
    } else {
        return blockArray.filter((b)=>{
            return (b.level==options.level && b.rhythmSet==options.rhythmSet);
        });
    }
};


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
    this.np = new notationPanel({targetEl: this.el});
    
    this.render = function(){
        this.el.className = "item block";
        this.np.updateNotation(this.noteString);
        this.np.render();
    };
    
};

const createBlockElement = function(block){
    let el = document.createElement("div");
    el.className = "item block " + (this.selected ? "selected": "");
    el.setAttribute("data-level",block.level);
    el.setAttribute("data-rhythmset",block.rhythmSet);
    el.setAttribute("id", block.noteString);
    el.onclick = block.toggleSelect;
    return el;
};


const buildBlockElements = function(blocks){
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
        b.np.updateNotation(b.noteString);
        b.np.render();
    });
};

const renderBlocks = function(){
    let blocksToDraw = filterBlocks({level: 1, rhythmSet: "A"});
    let target = document.getElementById("blocks-select-container");
    let blockEls = buildBlockElements(blocksToDraw);
    renderBlockElements(blockEls, target);
};

