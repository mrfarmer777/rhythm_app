
const createButton = function(levelObject){
    let button;
    const levelId = parseInt(levelObject.id);
    if(1 <= levelId && levelId <= 8){
        button = document.createElement("div");
        const image = document.createElement("img");
        image.setAttribute("src",levelObject.imgUrl);
        button.appendChild(image);
    } else {
        button = document.createElement("div");
        s = document.createElement("span");
        s.innerHTML = levelObject.id;
        button.appendChild(s);
    }
    button.className = "button-image level-button item";
    button.setAttribute("data-level", levelObject.id);
    button.onclick = levelObject.handleClick.bind(levelObject);
    return button;
};

const renderLevelButtons = function(levels, targetElement, selectedLevel){
    targetElement. innerHTML = "";
    levels.forEach((levelObject)=>{
        if(levelObject.includesRests === restsOn ){
            levelObject.el.className = "level-button item " + (levelObject.id === selectedLevel ? "selected": "");
            const levelId = parseInt(levelObject.id);
            if(1 <= levelId && levelId <= 8){
                levelObject.el.setAttribute("src",levelObject.imgUrl);
            } else {
                levelObject.el.firstChild.innerHTML = levelObject.id;
            }
            targetElement.appendChild(levelObject.el);
        }
    });
};


