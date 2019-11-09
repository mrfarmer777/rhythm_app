        

const createDiffButton = function(difficultyObject){
    let b = document.createElement("button");
    b.innerHTML = difficultyObject.id.toUpperCase();
    b.setAttribute("data-difficulty", difficultyObject.id);
    b.className = "difficulty-button item"
    b.onclick = difficultyObject.handleClick.bind(difficultyObject);
    return b;
};


const createRestButton = function(restsOn){
    let b = document.createElement("button");
    b.innerHTML = "Rests: "+ (restsOn ? "On":"Off");
    b.className = "difficulty-button item "+(restsOn ? "selected": "");
    b.setAttribute("id","rests-toggle-button");
    b.onclick = toggleRests;
    return b;
}

const Difficulty = function(difficultyId){
    this.id = difficultyId;
    this.selected = false;
    
    this.render = function(){
        this.el.className = "difficulty-button item " + (this.id === difficulty ? "selected": "");
    }

    this.handleClick = function(){
        changeDifficulty(this.id);
        //updateAvailableBlocks([level], difficulty);
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
    
    //Drawing options buttons here for now...
    const optsContainer = document.getElementById("option-buttons-container");
    optsContainer.innerHTML="";
    let restButton = createRestButton(restsOn);
    
    let infoButton = document.createElement('button');
    infoButton.setAttribute("id","myButton")
    infoButton.innerHTML = "Info"
    infoButton.className = "item difficulty-button";
    infoButton.addEventListener('click', function(){
      MicroModal.show('modal-1');    
    });
    optsContainer.appendChild(restButton);
    optsContainer.appendChild(infoButton);
};


