
//clear div
//document.querySelector("#toolsDiv > div:nth-child(1) >div")
// document.querySelector("#toolsDiv > div:nth-child(1) > span > select:nth-child(2)").appendChild(new Option("PR Viewer", "pr_viewer"));
let scrollNum;
chrome.storage.sync.get(['scroll'], function (items) {
    scrollNum = items.scroll;
    if (scrollNum == undefined || isNaN(parseInt(scrollNum))) {
        scrollNum = 4.0;
    }
});

let defaultLinkColor = getComputedStyle(document.querySelector(".click")).color;

const conversionTable = {
    "clkwca": "clock",
    "222so": "222",
    "333": "333",
    "333ni": "333bf",
    "333oh": "333oh",
    "444wca": "444",
    "444bld": "444bf",
    "555wca": "555",
    "555bld": "555bf",
    "666wca": "666",
    "777wca": "777",
    "mgmp": "minx",
    "pyrso": "pyram",
    "skbso": "skewb",
    "sqrs": "sq1",
    "333fm": "333fm"
};
// NO MULTI BLIND SUPPORT I HATE FORMAT
// "r3ni": "333mbf"

process();

async function process() {
    let prs = await getPRs();
    
    let lastIndex = 0;
    let nowIndex = 0;
    setInterval(() => {
        let toMonitor = document.querySelector("#stats > div.stattl > div > table > tbody > tr:nth-child(3)>td:nth-child(1)")
        // if elem doesnt exist
        if (!toMonitor) return;
        toMonitor = toMonitor.textContent;
        nowIndex = toMonitor;
        // console.log(lastIndex, nowIndex)
        if (lastIndex == nowIndex) { 
            // console.log('No Change');
        } else { 
            // console.log('New Time:', nowIndex);
            lastIndex = nowIndex;
            let currentEvent = document.querySelector("#scrambleDiv > div.title > nobr:nth-child(1) > select:nth-child(2)").value
            let currentSingle = (element => element ? element.textContent : null)(document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(2) > td:nth-child(2)"));
            let currentAo5 = (element => element ? element.textContent : null)(document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(4) > td:nth-child(2)"))
            
            //reset color
            document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(2) > td:nth-child(2)").style.color = defaultLinkColor;
            if(currentAo5) document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(4) > td:nth-child(2)").style.color = defaultLinkColor;
            
            
            //console.log(currentEvent, currentSingle, currentAo5)
            let csEvent = conversionTable[currentEvent];

            if (currentEvent == "333fm") console.log("For FMC, use typing and type 34 or 0.34 for 34 moves")
            if (currentEvent == "r3ni") console.log("Multi blind is not supported, sorry not sorry")

            
            if (prs[csEvent]) {
            
                // console.log("current average: "+currentSingle+"\ncurrent avg: "+currentAo5+"\nPR avg: "+prs[csEvent].average.best / 100 + "\nPR single: "+prs[csEvent].single.best / 100)
                try {
                    if(currentAo5.includes(":")){
                        //handle minutes
                        let minutes = currentAo5.split(":")[0];
                        let seconds = currentAo5.split(":")[1];
                        currentAo5 = minutes * 60 + parseFloat(seconds);
                    }
                    // console.log(currentAverage)
                    if ((prs[csEvent].average.best) / 100 >= currentAo5 && currentAo5 != "DNF" && !(currentAo5 <= 0)) {
                        document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(4) > td:nth-child(2)").style.color = "green";
                        displayMsg("Under PR Average!");
                    }
                } catch {
                    // they have a single but no average so cope
                }

                if(currentSingle.includes(":")){
                    //handle minutes
                    let minutes = currentSingle.split(":")[0];
                    let seconds = currentSingle.split(":")[1];
                    currentSingle = minutes * 60 + parseFloat(seconds);
                }
                // console.log(currentSingle)
                if ((prs[csEvent].single.best) / 100 >= (currentSingle)) {
                    document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(2) > td:nth-child(2)").style.color = "green";
                    displayMsg("Under PR Single!");
                }
            } else { 
                // they dont have a PR
            }
        }
        // });
    }, 1000);


    // observer.observe(toMonitor, config)
}

async function getPRs() {
    let items = await chrome.storage.sync.get(['wcaId'])
    let wcaId = items.wcaId;
    if (!wcaId || wcaId == "") {
        alert("Please set your WCA ID by clicking the extension icon\nSetting to default: 2009ZEMD01");
        wcaId = "2009ZEMD01";
    }
    // console.log(wcaId)
    let response = await fetch("https://www.worldcubeassociation.org/api/v0/persons/" + wcaId)
    let json = await response.json();

    return json.personal_records;
}

let toolSelect = document.querySelector(
  "#toolsDiv > div:nth-child(1) > span > select:nth-child(2)"
);
toolSelect.appendChild(new Option("PR Viewer", "pr_viewer"));
toolSelect.addEventListener("change", async () => {
  if (toolSelect.value == "pr_viewer") {
    updatePRs();
  }
});

//on event change trigger updatePRs()
document.querySelector("#scrambleDiv > div.title > nobr:nth-child(1) > select:nth-child(2)").addEventListener("change", (event) => {updatePRs()});

async function updatePRs() {
  let purrs = await getPRs();
  //console.log(purrs);
  document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(2) > td:nth-child(2)").style.color = defaultLinkColor;
  try{document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(4) > td:nth-child(2)").style.color = defaultLinkColor}catch{};

  const customEventOrder = [
    "clock",
    "222",
    "333",
    "444",
    "555",
    "666",
    "777",
    "pyram",
    "skewb",
    "sq1",
    "333bf",
    "444bf",
    "555bf",
    "333fm",
  ];
  const reversedConversionTable = Object.keys(conversionTable).reduce(
    (obj, key) => ({ ...obj, [conversionTable[key]]: key }),
    {}
  );
  let coolDiv = "";
  for (const event of customEventOrder) {
    if (event in purrs) {
      
        const singleBest = purrs[event].single.best / 100;
        const avgBest = purrs[event].average ? purrs[event].average.best / 100 : false;
        if (
          reversedConversionTable[event] ==
          document.querySelector(
            "#scrambleDiv > div.title > nobr:nth-child(1) > select:nth-child(2)"
          ).value
        ) {
          coolDiv =
            `<p><b>${event}:</b> ${Math.floor(singleBest / 60) > 0 ? `${Math.floor(singleBest / 60)}:` : ""}${(singleBest-Math.floor(singleBest / 60)*60).toFixed(2)} ${avgBest ? ` | ${Math.floor(avgBest / 60) > 0 ? `${Math.floor(avgBest / 60)}:` : ""}${(avgBest-Math.floor(singleBest / 60)*60).toFixed(2)}` : ""}</p><br>` + coolDiv;
        } else {
          coolDiv += `<p><b>${event}:</b> ${Math.floor(singleBest / 60) > 0 ? `${Math.floor(singleBest / 60)}:` : ""}${(singleBest-Math.floor(singleBest / 60)*60).toFixed(2)} ${avgBest ? ` | ${Math.floor(avgBest / 60) > 0 ? `${Math.floor(avgBest / 60)}:` : ""}${(avgBest-Math.floor(singleBest / 60)*60).toFixed(2)}` : ""}</p><br>`;
        }
      
    }
  }

  coolDiv =
    `<h3 style="text-align: center;">Your PRs</h3><h4 style="text-align: right;text-decoration: underline;">single | average</h4>` +
    coolDiv;

  //console.log(coolDiv);
  document.querySelector("#toolsDiv > div:nth-child(1) >div").innerHTML =
    coolDiv;
}

async function displayMsg(text) {

    // check if cstiemr+_ is already there 👍
    // change color to green
    let csPlus = document.querySelector("head > title").textContent.includes("+") ? `<small class="csplus">+</small>` : "";

    var defaultSpan = document.createElement("span");
    defaultSpan.innerHTML = `<span style="animation-duration: 5.1s;" class="">csTimer${csPlus}</span>`;

    var newSpan = document.createElement("span");

    newSpan.innerHTML = `
    <div class="pad" style="width: 332px;">csTimer${csPlus}</div>
    <span style="font-family: sans-serif; margin: 0 1em;">${text}</span>
    <div class="pad" style="width: 332px; position: absolute;">csTimer${csPlus}</div>
    `;
    newSpan.setAttribute("style", `animation-duration: ${scrollNum}s;`);
    newSpan.setAttribute("class", "hint");

    var logoSpan = document.querySelector("#logo > div > span");

    // wait until span class is empty
    while (logoSpan.className != "") {
        await new Promise(r => setTimeout(r, 100));
    }
    logoSpan.parentNode.replaceChild(newSpan, logoSpan);
    // wait (scroll) seconds
    await new Promise(r => setTimeout(r, scrollNum * 1000));
    // replace with default
    newSpan.parentNode.replaceChild(defaultSpan, newSpan);
}
