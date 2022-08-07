const gSheetKey = "1cLaiPoZreqxFma1bwdKrJpeIAXJtEeu8nU6TZ-_OFI4";

const levelsUrl = `https://docs.google.com/spreadsheets/d/${gSheetKey}/gviz/tq?tqx=out:json&sheet=Levels`
const blocksUrl = `https://docs.google.com/spreadsheets/d/${gSheetKey}/gviz/tq?tqx=out:json&sheet=Rhythm%20Blocks`

async function getCustomRhythms(){
    const customLevels = getCustomRhythmData(levelsUrl);
    const customBlocks = getCustomRhythmData(blocksUrl);
    const rhythmData = [customLevels, customBlocks];
    Promise.all(rhythmData)
        .then((results)=>{
            buildCustomLevels(results[0]);
            buildCustomBlocks(results[1]);
        })
        .catch((e)=>{
            console.warn(e);
            console.info("Cannot load custom rhythms. Building fallbacks...")
            buildFallbackRhythms();
        })
}

const getCustomRhythmData = async (url) => {
    const request = await fetch(url);
    const data = await request.text();
    const parsed_data = await JSON.parse(data.substr(47).slice(0,-2))
    return parsed_data
}


function buildCustomLevels(responseText){
    let customLevels = [];
    let parsedResponse = responseText;
    let entries = getEntries(parsedResponse);
    entries.forEach((e)=>{
        let newLevel = buildLevelFromEntry(e);
        if(newLevel.active){
            if(newLevel.isValid()){
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
    return parsedResponse.table.rows;
}

function buildLevelFromEntry(entry){
    let levelAttrs = {
        "name": ( entry.c[0] ? entry.c[0].v : ""),
        "description": ( entry.c[1] ? entry.c[1].f : ""),
        "measureBeats": ( entry.c[2] ? entry.c[2].v : ""),
        "quaver": ( entry.c[3] ? entry.c[3].v : ""),
        "active": ( entry.c[5] ? entry.c[5].v : ""),
        "compound": ( entry.c[6] ? entry.c[6].v : ""),
        "deadEighthsOn": ( entry.c[7] ? entry.c[7].v : ""),
        "deadSixteenthsOn": ( entry.c[8] ? entry.c[8].v : ""),
        "subLevels": getSubLevelArray(entry.c[4]===null ? "" : entry.c[4].f)
    }
    const newLevel = new Level(levelAttrs)
    return newLevel;
}

function buildBlockFromEntry(entry){
    let blockAttrs = {
        "level": ( entry.c[0] ? entry.c[0].v : ""),
        "rhythmSet": ( entry.c[0] ? entry.c[1].v.toLowerCase().split(",").map(rs => rs.trim()).filter(rhythmSet => rhythmSet !== "") : ""),
        "noteString": ( entry.c[0] ? entry.c[2].v.trim() : ""),
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