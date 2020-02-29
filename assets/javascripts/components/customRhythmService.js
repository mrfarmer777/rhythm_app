const gSheetKey = "1jIuWf_NE162ME9bH6XuBOXBdKfLhgnriu0WraTjaybQ"

const jsonUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/od6/public/values?alt=json`

let customLevels = [];

// Send async request to start custom rhythm request flow
getCustomRhythms()

function getCustomRhythms(){
    httpGetAsync(jsonUrl, buildCustomRhythms);
}



function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}



function buildCustomRhythms(responseText){
    //TODO handle errors from response text gracefully
    parsedResponse = JSON.parse(responseText);
    entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        level = buildLevelFromEntry(e);
        customLevels.push(level);
    })

    console.log(customLevels);

}

function getEntries(parsedResponse){
    return parsedResponse.feed.entry;
}

function buildLevelFromEntry(entry){
    let level = {
        "name": entry.gsx$name.$t,
        "description": entry.gsx$description.$t,
        "measureBeats": entry.gsx$measurebeats.$t,
        "quaver": entry.gsx$quaver.$t,
        "active": entry.gsx$active.$t,
    }
    return level;
}
