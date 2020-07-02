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
        res.push(p.toString())
    })
    return res;
}


const getParamLevel = function(){
    const p = getRawParams();
    return p.get("level");
}

const getParamActiveBlocks = function(){
    const p = getRawParams();
    let blockArr = p.get("blocks");
    if(blockArr != null){
      blockArr = blockArr.split(",");
    };
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
    if(paramLevel == null){
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
      let availableRhythmStrings = availableBlocks.map( b => { return b.noteString })
      let separatedBlockStrings = separateParamBlocks(availableRhythmStrings, blockStringArray);
      blockStringArray = separatedBlockStrings[0];
      let prohibitedBlocks = separatedBlockStrings[1];
      if (prohibitedBlocks.length > 0 ){
        console.info("Some rhythm blocks were excluded because they are not valid or unavailable in this level: " + prohibitedBlocks.join(","))
      }
      batchSelectBlocks(availableBlocks, blockStringArray);
      changeDifficulty('custom');
      checkActiveDifficulty();
      updateAvailableBlocks([level], difficulty);
    }
  }    
}
  

  
  