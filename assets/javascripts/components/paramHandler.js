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

const paramLevelValid = function(){
    return Levels.some((l) => l.name === getParamLevel() )
};


const handleQueryParams = function(){
    //If params exist
    if(paramsPresent()){
      if(paramLevelValid()){
        let paramLevel = getLevel(getParamLevel());

        console.log("now selecting level: "+ paramLevel)
        changeLevel(paramLevel);
        //select available blocks
        //notify when blocks are not available
      }
    }
      //if a valid level is given
        //select that level
        //if blocks are given
          //select blocks that are available
          //notify that some blocks are not available
      //elseif blocks are given
        //show all levels
        //select blocks that are available
        //notify that some blocks are not available
      //else
        //do nothing
    
}
  
handleQueryParams();
  
  