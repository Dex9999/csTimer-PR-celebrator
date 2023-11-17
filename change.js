
//clear div
//document.querySelector("#toolsDiv > div:nth-child(1) >div")
// document.querySelector("#toolsDiv > div:nth-child(1) > span > select:nth-child(2)").appendChild(new Option("PR Viewer", "pr_viewer"));
let scrollNum = 4.0;
chrome.storage.sync.get(['scroll'], function (items) {
    scrollNum = items.scroll;
    if (scrollNum == undefined || isNaN(parseInt(scrollNum))) {
        scrollNum = 4.0;
    }
});

let history = false;
chrome.storage.sync.get(['history'], function (items) {
  history = items.history;
    if (history == undefined) {
      history = false;
    }
});

let compsim = false;
chrome.storage.sync.get(['compSim'], function (items) {
  compsim = items.compSim;
    if (compsim == undefined) {
      compsim = false;
    }
});

let highlight = false;
chrome.storage.sync.get(['highlight'], function (items) {
  highlight = items.highlight;
    if (highlight == undefined) {
      highlight = false;
    }
});

let nodisplay = false;
chrome.storage.sync.get(['nodisplay'], function (items) {
  nodisplay = items.nodisplay;
    if (nodisplay == undefined) {
      nodisplay = false;
    }
});

let hex = "#00FF00";
  chrome.storage.sync.get(['hex'], function (items) {
  hex = items.hex;
    if (hex == undefined) {
      hex = "#00FF00";
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
            if (toolSelect.value == "bpa_viewer"){
              updateWPA();
            }
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
                        !(highlight) ? document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(4) > td:nth-child(2)").style.color = hex : document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(4) > td:nth-child(2)").style.backgroundColor = hex;
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
                  !(highlight) ? document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(2) > td:nth-child(2)").style.color = hex : document.querySelector("#stats > div.statc > table > tbody > tr:nth-child(2) > td:nth-child(2)").style.backgroundColor = hex;
                    displayMsg("Under PR Single!");
                }

                //check history should be shown
                if(history){
                  //single
                  let historySingle;
                  document.querySelectorAll("#stats > div.stattl > div > table > tbody > tr > td:nth-child(2)").forEach((time)=>{
                    historySingle = time.textContent;
                    if(time.textContent.includes(":")){
                        //handle minutes
                        let minutes = time.textContent.split(":")[0];
                        let seconds = time.textContent.split(":")[1];
                        historySingle = minutes * 60 + parseFloat(seconds);
                    }
                    // console.log(currentSingle)
                    if ((prs[csEvent].single.best) / 100 >= (historySingle)) {
                      !(highlight) ? time.style.color = hex : time.style.backgroundColor = hex;
                    }
                  })

                  let historyAvg;
                  document.querySelectorAll("#stats > div.stattl > div > table > tbody > tr > td:nth-child(3)").forEach((time)=>{
                    historyAvg = time.textContent;
                    if(time.textContent.includes(":")){
                        //handle minutes
                        let minutes = time.textContent.split(":")[0];
                        let seconds = time.textContent.split(":")[1];
                        historyAvg = minutes * 60 + parseFloat(seconds);
                    }
                    // console.log(currentSingle)
                    if ((prs[csEvent].single.best) / 100 >= (historyAvg)) {
                      !(highlight) ? time.style.color = hex : time.style.backgroundColor = hex;
                    }
                  })
                }
            } else { 
                // they dont have a PR
            }
            if(compsim){
              //single
              let last5 = [];
              Array.from(document.querySelectorAll("#stats > div.stattl > div > table > tbody > tr > td:nth-child(2)"))
                .slice(0, 6)
                .forEach((time) => {
                  last5.push(time);
                });
              for(let i = 0; i<last5.length; i++){
                !(highlight) ? last5[i].style.color = "inherit" : last5[i].style.backgroundColor = "inherit";
              }
              //temp use 6 to clear colour from last iteration
              last5.pop();

              last5.sort((a, b) => {
                let aTime = a.textContent;
                let bTime = b.textContent;
                let currSingle = aTime;
                  if (currSingle.includes(":")) {
                    // Handle minutes
                    let minutes = currSingle.split(":")[0];
                    let seconds = currSingle.split(":")[1];
                    currSingle = minutes * 60 + parseFloat(seconds);
                  }
                aTime = currSingle;
                currSingle = bTime;
                  if (currSingle.includes(":")) {
                    // Handle minutes
                    let minutes = currSingle.split(":")[0];
                    let seconds = currSingle.split(":")[1];
                    currSingle = minutes * 60 + parseFloat(seconds);
                  }
                bTime = currSingle;

                if (aTime < bTime) {
                  return -1;
                }
                if (aTime > bTime) {
                  return 1;
                }
                return 0;
              });
              !(highlight) ? last5[0].style.color = "dimgrey" : last5[0].style.backgroundColor = "dimgrey";
              !(highlight) ? last5[4].style.color = "dimgrey" : last5[4].style.backgroundColor = "dimgrey";
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

//hackey cstimer+ but it works 😭
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
      if (mutation.type === "characterData") {
          if(document.querySelector("head > title").textContent.includes("+")){
            toolSelect.appendChild(new Option("PR Viewer", "pr_viewer"));
            toolSelect.appendChild(new Option("BPA/WPA", "bpa_viewer"));
          }
          break; 
      }
  }
});

const observerConfig = { characterData: true, subtree: true };

observer.observe(document.head.querySelector("title"), observerConfig);

let toolSelect = document.querySelector(
  "#toolsDiv > div:nth-child(1) > span > select:nth-child(2)"
);
setTimeout(() => {
  toolSelect.appendChild(new Option("PR Viewer", "pr_viewer"));
  toolSelect.addEventListener("change", async (event) => {
    console.log(event.value);
    if (toolSelect.value == "pr_viewer") {
      updatePRs();
    }
  });
  toolSelect.appendChild(new Option("BPA/WPA", "bpa_viewer"));
  toolSelect.addEventListener("change", async (event) => {
    console.log(event.value);
    if (toolSelect.value == "bpa_viewer") {
      updateWPA();
    }
  });
}, 5000);

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

async function updateWPA() {
  let last4 = [];
  Array.from(document.querySelectorAll("#stats > div.stattl > div > table > tbody > tr > td:nth-child(2)"))
    .slice(0, 4)
    .forEach((time) => {
      last4.push(time.textContent);
    });
  let {BPA, Mean, WPA} = calculateMeans(last4);
  //console.log(BPA, Mean, WPA);
  let coolDiv = `<h3 style="text-align: center;"> <p style="color: green"><b>BPA:</b> ${BPA}</p><br><p style="color: red"><b>WPA:</b> ${WPA}</p><br><p><b>Mo4:</b> ${Mean}</p><br> </h3>`;
  document.querySelector("#toolsDiv > div:nth-child(1) >div").innerHTML =
    coolDiv;
}

async function displayMsg(text) {
  if (!nodisplay) {

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
}

//stolen from my codepen :)
function calculateMeans(times) {
  let hasDNF = 0;
  const milliseconds = times.map(time => {
    if (time.toLowerCase() === 'dnf') {
      hasDNF += 1;
      return Infinity;
    }

    const components = time.split(':').map(Number);
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    if (components.length >= 3) {
      minutes = components[0] || 0;
      seconds = components[1] || 0;
      milliseconds = components[2] || 0;
    } else if (components.length === 2) {
      minutes = components[0] || 0;
      seconds = components[1] || 0;
    } else if (components.length === 1) {
      seconds = components[0] || 0;
    }

    const totalMilliseconds = minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    return totalMilliseconds;
  });

  const nonDNFTimes = milliseconds.filter(time => time !== Infinity);

  const sum = nonDNFTimes.reduce((acc, ms) => acc + ms, 0);
  const mean = sum / nonDNFTimes.length;

  const sortedTimes = nonDNFTimes.sort((a, b) => a - b);
  const lowest = sortedTimes[0];
  const highest = sortedTimes[sortedTimes.length - 1];

  const sumWithoutLowest = sum - lowest;
  const sumWithoutHighest = sum - highest;
  const meanWithoutLowest = sumWithoutLowest / (nonDNFTimes.length - 1);
  const meanWithoutHighest = sumWithoutHighest / (nonDNFTimes.length - 1);

  return {
    BPA: (hasDNF == 2) ? 'DNF' : formatTime(meanWithoutHighest),
    WPA: hasDNF ? 'DNF' : formatTime(meanWithoutLowest),
    Mean: formatTime(mean),
  };

  function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    let millisecondsRemaining = milliseconds % 1000;

    millisecondsRemaining = Math.round(millisecondsRemaining * 10) / 100;

    if (minutes === 0) {
      if (millisecondsRemaining === 0) {
        return `${seconds}`;
      } else {
        return `${seconds}.${padZero(Math.floor(millisecondsRemaining), 2)}`;
      }
    }

    return `${minutes}:${padZero(seconds)}.${padZero(Math.floor(millisecondsRemaining), 2)}`;

    function padZero(num, length = 2) {
      return String(num).padStart(length, '0'); 
    }
  }
}
