const levelData = ["q", "e", "s", "4"];


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
        //this.render();
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

const renderLevelButtons = function(levels, targetEl, selectedLevel){
    targetEl.innerHTML = "";
    levels.forEach((levelObj)=>{
        levelObj.el.className = "level-button item " + (levelObj.id === selectedLevel ? "selected": "");
        targetEl.appendChild(levelObj.el);
    });
};


