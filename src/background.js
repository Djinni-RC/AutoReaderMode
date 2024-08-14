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
var TmpWebObject = new WebsiteObject();

function Nullcheck(value,strict){
    var valIsNull = false
    if(strict){
        valIsNull = (null === value || undefined === value)
    }else{
        valIsNull = (null == value || undefined == value)
    }

    if(valIsNull){
        return false
    }else{
        return value
    }
}

function WebsiteObject(success,urlObject,domContent,ReaderPath){
    /* Nullcheck variables */
    success = Nullcheck(success)
    if(!Nullcheck(urlObject)){urlObject = null}
    if(!Nullcheck(domContent)){domContent = null}
    if(!Nullcheck(ReaderPath)){ReaderPath = null}

    /* Create Object */
    this.success = success
    this.urlObject = urlObject
    this.domContent = domContent
    this.ReaderPath = ReaderPath
}


function initializeReaderSites() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("readerSites", (data) => {
            if (!data.readerSites) {
                chrome.storage.sync.set({ readerSites: [] }, () => {
                    resolve([]);
                });
            } else {
                resolve(data.readerSites);
            }
        });
    });
}

function handleURLRequest(webobj){
    validRequest = (null != webobj && undefined != webobj)
    if(validRequest){
        if(webobj.success){
            var newURL = convertUrl(webobj)
            if(null == newURL){newURL={success:false}}
            if (newURL.success) {
                chrome.tabs.update(null, {url:newURL.ReaderPath});
                TmpWebObject = new WebsiteObject()
            } else {
                //console.log("Did not receive a new URL from function.");
            }
        }
    }
}

function constructWebsiteObject(domContent){
    TmpWebObject.domContent = JSON.parse(atob(domContent))
    vaildURLObj = (null != TmpWebObject.urlObject && undefined != TmpWebObject.urlObject)
    validDOMCon = (null != domContent && undefined != domContent)
    if(!vaildURLObj || !validDOMCon){
        console.error(`Invalid construction;\nValid urlObject: ${vaildURLObj}\nValid domContent: ${validDOMCon}`)
    }else{
        TmpWebObject.success = true
    }

    handleURLRequest(TmpWebObject)
}

async function handleWebNavigation(details) {
    const sites = await initializeReaderSites();
    var urlObj = new URL(details.url)
    var prot = urlObj.protocol
    var validURL = (details.frameId === 0 && null != urlObj && prot == "https:")
    if (validURL) {
        try {
            if(sites.includes(urlObj.hostname)){
                /* try to fetch the arcticle elements */
                TmpWebObject.urlObject = urlObj
                chrome.tabs.sendMessage(details.tabId,{text:'ARM-ask-for-articles'},constructWebsiteObject)
                /* check if we get anything back */
            }
        } catch (e) {
            console.error("Error processing tab URL:", details.url, e);
        }
    } else {
        if(prot == "read:"){

        }else if (null == urlObj) {
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
