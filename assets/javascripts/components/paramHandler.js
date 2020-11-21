//TODO Add this as a service rather than a component
const getRawParams = function(){
    params = new URLSearchParams(window.location.search)
    return params
}

const paramsPresent = function(){
    return (window.location.search !== "");
}

const getParamArray = function(params){
    res = []
    params.forEach((p)=>{
        res.push(p.toString());
    })
    return res;
}


const getParamLevel = function(){
    const p = getRawParams();
    return p.get("level");
}

const getParamActiveBlocks = function(){
    const p = getRawParams();
    let blockArr = p.get("blocks"); //get blocks and clear white space
  
    if(blockArr != null){
      blockArr = blockArr.replace(/\s/g,'')
      blockArr = blockArr.split(",");
    }
    return blockArr;
}

const paramLevelValid = function(paramLevel){
    res = paramLevel == null ? false : Levels.some((l) => l.name === paramLevel.name )
    return res;
};

// Separate blocks from params into those that are available and those that are not
const separateParamBlocks = function(availableRhythmStrings, paramBlockStrings){
  let prohibitedStrings = [];
  let availableStrings = [];

  paramBlockStrings.forEach( s => {
    if(availableRhythmStrings.includes(s)){
      availableStrings.push(s);
    } else {
      prohibitedStrings.push(s);
    }
  })
  return [ availableStrings, prohibitedStrings ];
}


const handleQueryParams = function(){    
  if(paramsPresent()){
    let paramLevel = getLevel(getParamLevel());
    let blockStringArray = getParamActiveBlocks();

    //Handling blocks-only params
    //Defaults to the level of the first valid block
    if(paramLevel == null && blockStringArray !== null){
      let firstParamBlock = findBlockByNoteString(Blocks, blockStringArray[0])[0];
      paramLevel = getLevel(firstParamBlock.level)
    }

    if(paramLevelValid(paramLevel)){
      if(restsOn !== paramLevel.includesRests){
        toggleRests();
      };
      if(tupletsOn !== paramLevel.tuplet){
        toggleTuplets();
      }
      changeLevel(paramLevel);

      if(blockStringArray !== null){
        let availableRhythmStrings = availableBlocks.map( b => { return b.noteString });
        let separatedBlockStrings = separateParamBlocks(availableRhythmStrings, blockStringArray);
        blockStringArray = separatedBlockStrings[0];
        let prohibitedBlocks = separatedBlockStrings[1];
        if (prohibitedBlocks.length > 0 ){
          let notifyString = "Unavailable or invalid rhythms were excluded: " + prohibitedBlocks.join(", ")
          Toastify({
            text: notifyString,
            duration: 3000,
            gravity: "bottom",
            stopOnFocus: true,
          }).showToast();
          console.info("Some rhythm blocks were excluded because they are not valid or unavailable in this level: " + prohibitedBlocks.join(","))
        }
        //If none of the blocks provided are in the param level
        if(blockStringArray.length === 0){
          changeDifficulty(getAvailableDifficulties(availableBlocks)[0]);
        } 
        else {
          batchSelectBlocks(availableBlocks, blockStringArray);
          changeDifficulty('custom');
          checkActiveDifficulty();
        }
      }
      let la = paramLevel.getLevelArray();
      updateAvailableBlocks(la, difficulty);
    } else {
      console.info("Param level not valid");
      //set level to its default
      changeLevel(getLevel(level))
    }
  } else {
    changeLevel(getLevel(level));
    changeDifficulty(getAvailableDifficulties(availableBlocks)[0]);
    updateAvailableBlocks(activeLevel.getLevelArray(), difficulty);
  }    
}
  

  
  