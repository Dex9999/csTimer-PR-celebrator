document.addEventListener('DOMContentLoaded', function () { // check if exists to display
    const currId = document.getElementById('current');
    chrome.storage.sync.get(['wcaId'], function (items) {
        currId.innerHTML = items.wcaId;
    });

    // check if exists to display
    const scrollElem = document.getElementById('currScroll');
    chrome.storage.sync.get(['scroll'], function (items) {
        scrollElem.innerHTML = items.scroll;
    });

    const hexElem = document.getElementById('currColor');
    chrome.storage.sync.get(['hex'], function (items) {
        hexElem.innerHTML = items.hex;
    });


    const historyElem = document.getElementById('history');
    chrome.storage.sync.get(['history'], function (items) {
        historyElem.checked = items.history;
    });
    const highlightElem = document.getElementById('highlight');
    chrome.storage.sync.get(['highlight'], function (items) {
        highlightElem.checked = items.highlight;
    });

    // if not set, make default
    chrome.storage.sync.get(['scroll'], function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            if (items.scroll === undefined) {
                chrome.storage.sync.set({scroll: 3.0});
            }
        }
    });
    chrome.storage.sync.get(['hex'], function (items) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            if (items.hex === undefined) {
                chrome.storage.sync.set({hex: "#00FF00"});
            }
        }
    });


    const searchInput = document.getElementById('urlInput');
    searchInput.focus();
    searchInput.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            chrome.storage.sync.set({
                wcaId: searchInput.value
            }, function () {
                alert("WCA ID is now set to:\n" + searchInput.value);
                
            });
        }
    })

    const scrollInput = document.getElementById('scrollInput');
    scrollInput.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            let x = scrollInput.value;

            if (!isNaN(x)) {
                    chrome.storage.sync.set({
                        scroll: x
                    }, function () {
                        alert("Scroll speed is now set to: " + x);
                    });
            } else {
                alert("Please enter a number");
            }
        }
    })

    const hexInput = document.getElementById('hex');
    hexInput.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            let x = hexInput.value;

            if (x.length === 7 && x[0] === '#') {
                chrome.storage.sync.set({
                    hex: x
                }, function () {
                    alert("Highlight color is now set to: " + x);
                });
            } else {
                alert("Please enter a valid hex color");
            }
        }
    })

    const historyInput = document.getElementById('history');
    historyInput.addEventListener('change', (e) => {
        chrome.storage.sync.set({
            history: historyInput.checked
        }, function () {
            alert("History is now set to: " + historyInput.checked);
        });
    })

    const highlightInput = document.getElementById('highlight');
    highlightInput.addEventListener('change', (e) => {
        chrome.storage.sync.set({
            highlight: highlightInput.checked
        }, function () {
            alert("Highlight is now set to: " + highlightInput.checked);
        });
    })
    const compSimInput = document.getElementById('compsim');
    compSimInput.addEventListener('change', (e) => {
        chrome.storage.sync.set({
            compSim: compSimInput.checked
        }, function () {
            alert("Compsim is now set to: " + compSimInput.checked);
        });
    })
});
