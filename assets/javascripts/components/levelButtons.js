
const createButton = function(levelObject){
    let b; 
    if(1 <= parseInt(levelObject.id) && parseInt(levelObject.id) <= 8){
        //Hard-coded levels that are required forthe project
        //get images on their level selection buttons
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


