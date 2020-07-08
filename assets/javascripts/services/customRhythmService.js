const gSheetKey = "1jIuWf_NE162ME9bH6XuBOXBdKfLhgnriu0WraTjaybQ"

const levelsUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/1/public/values?alt=json`
const blocksUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/2/public/values?alt=json`




function getCustomRhythms(){
    httpGetAsync(levelsUrl, buildCustomLevels);
    httpGetAsync(blocksUrl, buildCustomBlocks)
}

function httpGetAsync(theUrl, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}



function buildCustomLevels(responseText){
    let customLevels = [];
    //TODO handle errors from response text gracefully
    let parsedResponse = JSON.parse(responseText);
    let entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        let newLevel = buildLevelFromEntry(e);
        if(newLevel.active){
            if(newLevel.isValid()){
                //Let's add it to the pre-made levels!
                if(newLevel.quaver===8){
                    CompoundLevels.push(newLevel);
                } else {
                    SimpleLevels.push(newLevel);
                }   
                Levels.push(newLevel);                 
            } else {
                console.warn(`Custom Level ${newLevel.name} was not included for the following reasons: ` + newLevel.errors.join(""))
            }
        }            
    })
    renderLevelButtons(SimpleLevels, levelButtonTarget, level);
    Levels.concat(customLevels);
    handleQueryParams();
    Toastify({
        text: "Custom Levels loaded",
        duration: 3000,
        gravity: "bottom"
    }).showToast();
}


function buildCustomBlocks(responseText){
    let customBlocks = [];
    let parsedResponse = JSON.parse(responseText);
    let entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        block = buildBlockFromEntry(e);
        if(block.isValid()){
            Blocks.push(block);
        } else {
            console.warn(`Custom block ${block.noteString} was not included for the following reasons: `+ block.errors.join(""))
        }
    })
}

function renderCustomLevelButtons(){
    renderLevelButtons(customLevels, customLevelButtonTarget, level);
}

function getEntries(parsedResponse){
    return parsedResponse.feed.entry;
}

function buildLevelFromEntry(entry){
    let levelAttrs = {
        "name": entry.gsx$name.$t,
        "description": entry.gsx$description.$t,
        "measureBeats": parseInt(entry.gsx$measurebeats.$t),
        "quaver": parseInt(entry.gsx$quaver.$t),
        "active": (entry.gsx$active.$t === "TRUE"),
        "subLevels": getSubLevelArray(entry.gsx$sublevels.$t)
    }
    const newLevel = new Level(levelAttrs)
    return newLevel;
}

function buildBlockFromEntry(entry){
    let blockAttrs = {
        "level": entry.gsx$level.$t,
        "rhythmSet": entry.gsx$rhythmset.$t.toLowerCase(),
        "noteString": entry.gsx$notestring.$t,
    }
    const newBlock = new rhythmBlockElement(blockAttrs);
    return newBlock;
}

function getSubLevelArray(subLevelString){
    let res = subLevelString==="" ? [] : subLevelString.split(",")
    return res;
}




