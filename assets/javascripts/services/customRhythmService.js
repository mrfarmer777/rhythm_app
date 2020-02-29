const gSheetKey = "1jIuWf_NE162ME9bH6XuBOXBdKfLhgnriu0WraTjaybQ"

const jsonUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/od6/public/values?alt=json`




function getCustomRhythms(){
    httpGetAsync(jsonUrl, buildCustomRhythms);
}

function getCustomLevels(){
    let res = httpGetAsync(jsonUrl, buildCustomLevels);
    return res
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




