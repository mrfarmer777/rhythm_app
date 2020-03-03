const gSheetKey = "1jIuWf_NE162ME9bH6XuBOXBdKfLhgnriu0WraTjaybQ"

const levelsUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/1/public/values?alt=json`
const blocksUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/2/public/values?alt=json`




function getCustomRhythms(){
    httpGetAsync(levelsUrl, buildCustomLevels);
    httpGetAsync(blocksUrl, buildCustomBlocks)
}

function httpGetAsync(theUrl, callback)
{
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
        level = buildLevelFromEntry(e);
        if(level.active === true){
            customLevels.push(level);
        }
    })

    console.log(customLevels);
    renderLevelButtons(customLevels,customLevelButtonTarget,level);
}


function buildCustomBlocks(responseText){
    let customBlocks = [];
    let parsedResponse = JSON.parse(responseText);
    let entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        block = buildBlockFromEntry(e);
        Blocks.push(block);
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
        "measureBeats": entry.gsx$measurebeats.$t,
        "quaver": entry.gsx$quaver.$t,
        "active": (entry.gsx$active.$t === "TRUE"),
    }
    const newLevel = new Level(levelAttrs)
    return newLevel;
}

function buildBlockFromEntry(entry){
    let blockAttrs = {
        "level": entry.gsx$level.$t,
        "rhythmset": entry.gsx$rhythmset.$t,
        "notestring": entry.gsx$notestring.$t,

    }
    const newBlock = new rhythmBlockElement(blockAttrs);
    return newBlock;
}




