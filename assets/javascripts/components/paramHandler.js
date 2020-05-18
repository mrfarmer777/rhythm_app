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
    const blockArr = p.get("blocks").split(",");
    return blockArr;
}

const paramLevelValid = function(paramLevel){
    res = paramLevel == null ? false : Levels.some((l) => l.name === paramLevel.name )
    return res;
};

const handleQueryParams = function(){
    //If any params exist
    
    if(paramsPresent()){
      let paramLevel = getLevel(getParamLevel());
      let blockStringArray = getParamActiveBlocks();
      if(paramLevelValid(paramLevel)){
        changeLevel(paramLevel);
        let availableBlocks = filterBlocksByLevels(Blocks, [level]);
        batchSelectBlocks(availableBlocks, blockStringArray)
        changeDifficulty('custom')
        clearBlocks();
        checkActiveDifficulty();
      } else if (paramLevel === null & blockStringArray.length > 0){
        changeLevel(8);
      }
      



    }
      //if a valid level is given
        //select that level
        //if blocks are given
          //select blocks that are available
          //notify that some blocks are not available
        //elseif (blocks not given)
          //select "A" difficulty for the provided level
      //elseif blocks are given
        //show all levels
        //select blocks that are available
        //notify that some blocks are not available
      //else
        //do nothing
    
}
  

  
  