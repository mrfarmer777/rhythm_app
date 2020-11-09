//const levelData = ["1", "2", "3", "4", "5", "6", "7"];


const createButton = function(levelObject){
    let b; 
    if(1 <= parseInt(levelObject.id) && parseInt(levelObject.id) <= 8){
        //Hard-coded levels that are part of the project
        b = document.createElement("div");
        i = document.createElement("img");
        i.setAttribute("src",levelObject.imgUrl);
        b.appendChild(i);
    } else {
        b = document.createElement("div");
        s = document.createElement("span");
        s.innerHTML = levelObject.id;
        b.appendChild(s);
    }
    b.className = "button-image level-button item";
    b.setAttribute("data-level", levelObject.id);
    b.onclick = levelObject.handleClick.bind(levelObject);
    return b;
};

/*
const Level = function(levelId){
    this.id = levelId;
    this.imgUrl = "./assets/images/"+this.id+".png";
    this.restImgUrl = "./assets/images/"+this.id+"-r.png";
    this.selected = false;
    this.tuplet = (["5", "6", "7", "8"].includes(this.id) ? true : false);
    this.handleClick = function(){
        changeLevel(this.id);
    };
    
    this.el = createButton(this);
};
*/

/*
const buildLevels = function(levelArray){
    let res = [];
    levelArray.forEach((l) =>{
        let levelObject = new Level(l);
        res.push(levelObject);
    });
    return res;
};
*/
const renderLevelButtons = function(levels, targetEl, selectedLevel){
    targetEl. innerHTML = "";
    levels.forEach((levelObj)=>{
        if(levelObj.includesRests === restsOn ){
            levelObj.el.className = "level-button item " + (levelObj.id === selectedLevel ? "selected": "");
            if(1 <= parseInt(levelObj.id) && parseInt(levelObj.id) <= 8){
                levelObj.el.setAttribute("src",levelObj.imgUrl);
            } else {
                levelObj.el.firstChild.innerHTML = levelObj.id;
            }
            targetEl.appendChild(levelObj.el);

        }
    });
};


