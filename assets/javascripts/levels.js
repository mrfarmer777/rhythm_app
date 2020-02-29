const levelData = [
    {name: "1", quaver: 4, measureBeats: 4, active: true, subLevels: []},
    {name: "2", quaver: 4, measureBeats: 4, active: true, subLevels: []},
    {name: "3", quaver: 4, measureBeats: 4, active: true, subLevels: []},
    {name: "4", quaver: 4, measureBeats: 4, active: true, subLevels: ["1","2","3"]},
    {name: "5", quaver: 8, measureBeats: 6, active: true, subLevels: []},
    {name: "6", quaver: 8, measureBeats: 6, active: true, subLevels: []},
    {name: "7", quaver: 8, measureBeats: 6, active: true, subLevels: []},
    {name: "8", quaver: 8, measureBeats: 6, active: true, subLevels: ["5", "6", "7"]},
]


const Level = function(opts){
    this.name = opts["name"];
    this.id = opts["name"]; //added for backward compatibility
    this.imgUrl = "./assets/images/"+this.id+".png";
    this.restImgUrl = "./assets/images/"+this.id+"-r.png";
    this.selected = false;
    this.tuplet = (["5", "6", "7", "8"].includes(this.id) ? true : false); //added for backward compability
    this.quaver = opts["quaver"];
    this.measureBeats = opts["measureBeats"];
    this.active = opts["active"];
    this.subLevels = opts["subLevels"];
    this.levelBlocks = [];
    this.handleClick = function(){
        changeLevel(this.id);
    }
    this.el = createButton(this);
}

/*
this.id = levelId;
    this.imgUrl = "./assets/images/"+this.id+".png";
    this.restImgUrl = "./assets/images/"+this.id+"-r.png";
    this.selected = false;
    this.tuplet = (["5", "6", "7", "8"].includes(this.id) ? true : false);
    this.handleClick = function(){
        changeLevel(this.id);
    };
    
    this.el = createButton(this);
*/

const buildLevels = function(){
    let res = [];
    levelData.forEach((l)=>{
        levelInstance = new Level(l)
        res.push(levelInstance);
    })
    return res;
}


