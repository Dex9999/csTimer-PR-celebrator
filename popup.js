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

});
