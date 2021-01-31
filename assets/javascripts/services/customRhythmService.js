const gSheetKey = "1jIuWf_NE162ME9bH6XuBOXBdKfLhgnriu0WraTjaybQ";
const gSheetKeyTest = "1cu8G2PhkFAUESFaas6Sxj9xx3npkIS51Ynh6-0q0xHw";

const levelsUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/1/public/values?alt=json`
const blocksUrl = `http://spreadsheets.google.com/feeds/list/${gSheetKey}/2/public/values?alt=json`


async function getCustomRhythms(){      
    const customLevels = getCustomRhythmData(levelsUrl);
    const customBlocks = getCustomRhythmData(blocksUrl);
    const rhythmData = [customLevels, customBlocks];
    Promise.allSettled(rhythmData)
        .then((results)=>{
            buildCustomLevels(results[0].value);
            buildCustomBlocks(results[1].value);
        })
        .catch((e)=>{
            console.warn(e);
            console.info("Cannot load custom rhythms. Building fallbacks...")
            buildFallbackRhythms();
        })
    // httpGetAsync(levelsUrl, buildCustomLevels);
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


const getCustomRhythmData = async (url) => {
    const request = await fetch(url);
    const data = await request.json();
    return data;
}


function buildCustomLevels(responseText){
    // httpGetAsync(blocksUrl, buildCustomBlocks);
    let customLevels = [];
    let parsedResponse = responseText;
    let entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        let newLevel = buildLevelFromEntry(e);
        if(newLevel.active){
            if(newLevel.isValid()){
                //Let's add it to the pre-made levels!
                if(newLevel.compound){
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
    Toastify({
        text: "Custom Levels loaded",
        duration: 3000,
        gravity: "bottom"
    }).showToast();
}


function buildCustomBlocks(responseText){
    let levelNames = Levels.map((l) => { return l.name });
    let parsedResponse = responseText;
    let entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        let block = buildBlockFromEntry(e);
        
        if(levelNames.includes(block.level)){
            //Updates notation so that beat length can be accurately counted
            //Must be done before checking validity
            const levelObj = getLevel(block.level);
            block.np.numberOfBeats = levelObj.measureBeats;
            block.np.quaver  = levelObj.quaver;
            block.np.timeSignature = ""+block.np.numberOfBeats+"/"+block.np.quaver;
            block.np.beamGrouping = (["6/8","3/8","12/8"].includes(block.np.timeSignature) ? new VF.Fraction(3,8): new VF.Fraction(2,8));
            block.np.updateNotation(block.noteString);
            block.beatLength = block.np.beatLength(); 
            if(block.isValid()){
                Blocks.push(block);
            } else {
                console.warn(`Custom block ${block.noteString} was not included for the following reasons: `+ block.errors.join(""))
            }
        }
    });
    handleQueryParams();
}

function renderCustomLevelButtons(){
    renderLevelButtons(customLevels, customLevelButtonTarget, level);
}

function getEntries(parsedResponse){
    return parsedResponse.feed.entry;
}

function buildLevelFromEntry(entry){
    let levelAttrs = {
        "name": entry.gsx$name.$t.trim(),
        "description": entry.gsx$description.$t,
        "measureBeats": parseInt(entry.gsx$measurebeats.$t),
        "quaver": parseInt(entry.gsx$quaver.$t),
        "active": (entry.gsx$active.$t === "TRUE"),
        "compound": (entry.gsx$compound.$t === "TRUE"), 
        "subLevels": getSubLevelArray(entry.gsx$sublevels.$t)
    }
    const newLevel = new Level(levelAttrs)
    return newLevel;
}

function buildBlockFromEntry(entry){
    let blockAttrs = {
        "level": entry.gsx$level.$t.trim(),
        "rhythmSet": entry.gsx$rhythmset.$t.toLowerCase().split(",").map(rs => rs.trim()).filter(rhythmSet => rhythmSet !== ""),
        "noteString": entry.gsx$notestring.$t.trim(),
    }
    const newBlock = new rhythmBlockElement(blockAttrs);
    return newBlock;
}

function getSubLevelArray(subLevelString){
    let res = subLevelString==="" ? [] : subLevelString.split(",")
    return res;
}

function buildFallbackRhythms(){
    Levels = buildFallbackLevels();
    sortedLevels = sortLevels(Levels);
    SimpleLevels = sortedLevels[0]
    CompoundLevels = sortedLevels[1]
    Blocks = buildFallbackBlocks(blockData);
    changeLevel(getLevel(level))
    renderLevelButtons(SimpleLevels, levelButtonTarget, level);
}