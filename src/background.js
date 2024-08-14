/* Stolen from;
    Live: https://stackoverflow.com/a/28620642
    Archived [2024-08-14]: https://web.archive.org/web/20240814122832/https://stackoverflow.com/questions/14500091/uncaught-referenceerror-importscripts-is-not-defined/28620642#28620642
*/
// proper initialization
if ("function" === typeof importScripts) {
    importScripts("utils.js");
    addEventListener("message", onMessage);

    function onMessage(e) {
        console.log("debug:\n",e)
    }
}

function initializeReaderSites() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("readerSites", (data) => {
            if (!data.readerSites) {
                chrome.storage.sync.set({ readerSites: [] }, () => {
                    console.log("Initialized readerSites in storage.");
                    resolve([]);
                });
            } else {
                console.log(
                    "readerSites already initialized:",
                    data.readerSites
                );
                resolve(data.readerSites);
            }
        });
    });
}

async function handleWebNavigation(details) {
    var urlObj = new URL(details.url)
    var prot = urlObj.protocol
    var validURL = (details.frameId === 0 && null != urlObj && prot == "https:")
    if (validURL) {
        try {
            if(sites.includes(urlObj.hostname)){
                const newUrl = convertUrl(urlObj);
                /* check if we get anything back */
                if(null != newUrl){
                    chrome.tabs.update(null,newUrl)
                }else{
                    console.log(
                        "Did not receive a new URL from function."
                    )
                }
            }
        } catch (e) {
            console.error("Error processing tab URL:", details.url, e);
        }
    } else {
        if (null == urlObj) {
            console.warn(
                "WebNavigation URL is undefined or empty. This may happen for new tabs, discarded tabs, or internal Chrome pages."
            );
        }else if(prot != "https:"){
            console.warn(
                "Invalid protocol (not https)"
            )
        }else{
            console.warn(
                "Unspecified failure."
            )
        }
    }
}

chrome.runtime.onInstalled.addListener(() => {
    initializeReaderSites();
});

chrome.runtime.onStartup.addListener(() => {
    initializeReaderSites();
});

chrome.webNavigation.onCompleted.addListener(handleWebNavigation);
