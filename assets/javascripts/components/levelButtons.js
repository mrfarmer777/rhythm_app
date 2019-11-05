const levelData = ["q", "e", "s"];


const createButton = function(levelObject){
    let b = document.createElement("button");
    b.innerHTML = levelObject.id;
    b.setAttribute("data-level", levelObject.id);
    b.className = "level-button item"
    b.onclick = levelObject.handleClick.bind(levelObject);
    return b;
};

const Level = function(levelId){
    this.id = levelId;
    this.selected = false;
    
    this.render = function(){
        this.el.className = "level-button item " + (this.id === level ? "selected": "");
    }

    this.handleClick = function(){
        changeLevel(this.id);
        updateAvailableBlocks([level], difficulty);
        this.render();
    };
    
    this.el = createButton(this);
};

const buildLevels = function(levelArray){
    let res = [];
    levelArray.forEach((l) =>{
        let levelObject = new Level(l);
        res.push(levelObject);
    });
    return res;
};

const renderLevelButtons = function(levels, targetEl){
    targetEl.innerHTML = "";
    levels.forEach((levelObj)=>{
        targetEl.appendChild(levelObj.el);
    });
};


const Levels = buildLevels(levelData);
const levelButtonTarget = document.getElementById("quaver-select-container");
renderLevelButtons(Levels, levelButtonTarget);