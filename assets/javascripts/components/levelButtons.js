const levelData = ["q", "e", "s", "4"];


const createButton = function(levelObject){
    let b = document.createElement("button");
    let image = document.createElement("img");
    image.className = "button-image";
    image.setAttribute("src",levelObject.imgUrl);
    b.appendChild(image);
    b.setAttribute("data-level", levelObject.id);
    b.className = "level-button item"
    b.onclick = levelObject.handleClick.bind(levelObject);
    return b;
};

const Level = function(levelId){
    this.id = levelId;
    this.imgUrl = "./assets/images/"+this.id+".png";
    this.selected = false;
    
    this.render = function(){
        this.el.className = "level-button item " + (this.id === level ? "selected": "");
        this.el.innerHTML
    }

    this.handleClick = function(){
        changeLevel(this.id);
        //this.render();
    };
    
    this.el = createButton(this);
};

const buildButtonImage = function(levelObj){
    
    return image
}

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


