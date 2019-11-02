const createButton = function(note){
    let el = document.createElement("div");
    let canvasContainer = document.createElement("div");
    let canvas = document.createElement("canvas");
    let np = new notationPanel({targetEl: canvas, panelType: "block"})
    
    
    canvasContainer.appendChild(canvas);
    el.appendChild(canvasContainer);
    
    el.className = "item block";
    canvasContainer.className = "container"
    np.updateNotation(note);
    np.render();
    return el;
};


const buildButtons = function(noteArray){
    let target = document.getElementById("quaver-select-container");
    noteArray.forEach((n)=>{
        let el = createButton(n);
        target.appendChild(el);
    })
}