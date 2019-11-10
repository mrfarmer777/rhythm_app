const levelData = ["q", "e", "s", "4","t"];


const createButton = function(levelObject){
    let b = document.createElement("img");
    // image = document.createElement("img");
    b.className = "button-image level-button item";
    b.setAttribute("src",levelObject.imgUrl);
    b.setAttribute("data-level", levelObject.id);
    b.onclick = levelObject.handleClick.bind(levelObject);
    return b;
};

const Level = function(levelId){
    this.id = levelId;
    this.imgUrl = "./assets/images/"+this.id+".png";
    this.restImgUrl = "./assets/images/"+this.id+"-r.png";
    this.selected = false;
    
    // this.render = function(){
    //     this.el.className = "level-button item " + (this.id === level ? "selected": "");
    //     this.el.innerHTML;
    // }

    this.handleClick = function(){
        changeLevel(this.id);
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
        levelObj.el.setAttribute("src",(restsOn ? levelObj.restImgUrl : levelObj.imgUrl));
        targetEl.appendChild(levelObj.el);
    });
};


