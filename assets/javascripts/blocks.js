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
    this.el = createBlockElement(this);
    this.np = new notationPanel({targetEl: this.el});
};

const createBlockElement = function(block){
    let el = document.createElement("div");
    el.className = "item block";
    el.setAttribute("data-level",block.level);
    el.setAttribute("data-rhythmset",block.rhythmSet);
    return el;
}


const buildBlockElements = function(blocks){
    let res = [];
    blocks.forEach((b) => {
        let rbe = new rhythmBlockElement(b);
        res.push(rbe);
    })
    return res;
}

const renderBlockElements = function(blocksEls,targetEl){
    blocksEls.forEach((b)=>{
        targetEl.appendChild(b.el);
        b.np.updateNotation(b.noteString);
        b.np.render();
    });
};

const renderBlocks = function(){
    let blocksToDraw = filterBlocks({level: 1, rhythmSet: "A"});
    console.log("Blocks to render: " + blocksToDraw);
    let target = document.getElementById("blocks-select-container");
    let blockEls = buildBlockElements(blocksToDraw);
    renderBlockElements(blockEls, target);
}