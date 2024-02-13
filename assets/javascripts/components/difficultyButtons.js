

const createDifficultyButton = function(difficultyObject){
    let button = document.createElement("button");
    button.innerHTML = difficultyObject.id.toUpperCase();
    button.setAttribute("data-difficulty", difficultyObject.id);
    button.className = "difficulty-button item"
    button.onclick = difficultyObject.handleClick.bind(difficultyObject);
    return button;
};

const Difficulty = function(difficultyId){
    this.id = difficultyId;
    this.selected = false;

    this.render = function(){
        this.el.className = "difficulty-button item " + (this.id === difficulty ? "selected": "");
    }

    this.handleClick = function(){
        selectDifficulty(this.id);
        this.render();
    };

    this.el = createDifficultyButton(this);
};

const buildDifficulties = function(difficultyArray){
    let res = [];
    difficultyArray.forEach((d) =>{
        let difficultyObject = new Difficulty(d);
        res.push(difficultyObject);
    });
    return res;
};

const renderDifficultyButtons = function(difficulties, targetEl, selectedDifficulty){
    targetEl.innerHTML = "";
    difficulties.forEach((diffObj)=>{
        diffObj.el.className = "difficulty-button item " + (diffObj.id === selectedDifficulty ? "selected": "");
        if(!restsOn || diffObj.id.includes("-r")){
            targetEl.appendChild(diffObj.el);
        }
    });
};


