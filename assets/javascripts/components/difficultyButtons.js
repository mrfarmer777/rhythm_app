

const createDiffButton = function(difficultyObject){
    let b = document.createElement("button");
    b.innerHTML = difficultyObject.id.toUpperCase();
    b.setAttribute("data-difficulty", difficultyObject.id);
    b.className = "difficulty-button item"
    b.onclick = difficultyObject.handleClick.bind(difficultyObject);
    return b;
};

const Difficulty = function(difficultyId){
    this.id = difficultyId;
    this.selected = false;

    this.render = function(){
        this.el.className = "difficulty-button item " + (this.id === difficulty ? "selected": "");
    }

    this.handleClick = function(){
        changeDifficulty(this.id);
        this.render();
    };

    this.el = createDiffButton(this);
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


