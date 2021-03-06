//Standard Level Data
//This is used as a fallback for the fully custom rhythm data failing 
const levelData = [
    {name: "1", quaver: 4, measureBeats: 4, active: true, compound: false, subLevels: []},
    {name: "1-r", quaver: 4, measureBeats: 4, active: true, compound: false, subLevels: ["1"]},
    {name: "2", quaver: 4, measureBeats: 4, active: true, compound: false, subLevels: []},
    {name: "2-r", quaver: 4, measureBeats: 4, active: true, compound: false, subLevels: ["2"]},
    {name: "3", quaver: 4, measureBeats: 2, active: true, compound: false, subLevels: []},
    {name: "3-r", quaver: 4, measureBeats: 2, active: true, compound: false, subLevels: ["3"]},
    {name: "4", quaver: 4, measureBeats: 4, active: true, compound: false, subLevels: ["4e","3"]},
    {name: "4-r", quaver: 4, measureBeats: 4, active: true, compound: false, subLevels: ["4e","3-r"]},
    {name: "5", quaver: 8, measureBeats: 6, active: true, compound: true, subLevels: []},
    {name: "6", quaver: 8, measureBeats: 6, active: true, compound: true, subLevels: []},
    {name: "7", quaver: 8, measureBeats: 6, active: true, compound: true, subLevels: []},
]


//Level constructor function
const Level = function(opts){
    this.name = opts["name"];
    this.id = opts["name"]; //added for backward compatibility
    this.imgUrl = "./assets/images/"+this.id+".png";
    this.selected = false;
    this.tuplet = opts["compound"];
    this.quaver = opts["quaver"];
    this.measureBeats = opts["measureBeats"];
    this.active = opts["active"];
    this.subLevels = opts["subLevels"];
    this.compound = opts["compound"];
    this.deadEighthsOn = opts["deadEighthsOn"];
    this.deadSixteenthsOn = opts["deadSixteenthsOn"];
    this.levelBlocks = [];
    this.handleClick = function(){
        changeLevel(this);
    }
    this.getLevelArray = function(){
        return this.subLevels.concat(this.name)
    }

    this.isValid = function(){
        if (!Number.isInteger(this.measureBeats)){
            this.errors.push("Measure beats must be an integer");
        }
        if (![1,2,4,8,16,32].includes(this.quaver)){
            this.errors.push("Quavers must be valid (1,2,4,8,16,32)");
        }
        if (!this.hasBlocks){
            this.errors.push("Levels must have at least 2 rhythm blocks");
        }
        if (!this.nameUnique){
            this.errors.push("Another level of the same name is already present");
        }

        return this.errors.length===0
    }

    this.errors = [];

    this.nameUnique = function(){
        return !Levels.some((l) => l.name === this.name)
    }

    this.hasBlocks = function(){
        return Blocks.filter((b)=> b.level === this.name).length > 1
    }

    this.el = createButton(this);
    this.includesRests = (opts["name"].includes("-r"))
}


const buildFallbackLevels = function(){
    let res = [];
    levelData.forEach((l)=>{
        levelInstance = new Level(l)
        res.push(levelInstance);
    })
    return res;
}

const getLevel = function(name){
    return Levels.find(l => l.name===name)
}



