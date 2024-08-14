/* Based on;
    Live: https://stackoverflow.com/a/19758800
    Archived [2023-03-08]: https://web.archive.org/web/20230308085919/https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content/19758800#19758800
*/

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse){
        //console.log(`${sender.origin} sent: ${msg.text}`)
        if(msg.text === 'ARM-ask-for-articles'){
            var srcArticles = document.getElementsByTagName("article")
            var fixedArticles = []
            for(var i=0;i<srcArticles.length;i++){
                var art = srcArticles[i]
                fixedArticles[i]={
                    classList:art.classList,
                    className:art.className,
                    baseURI:art.baseURI
                }
            }
            var asjson = JSON.stringify(fixedArticles)
            var asb64 = btoa(asjson)
            var debugmsg = ""
            if(null != fixedArticles){
                debugmsg = `${fixedArticles.length} article objects.`
            }else{
                debugmsg = `null`
            }
            //console.log(`Responded with: ${debugmsg}`)
            sendResponse(asb64)
        }else{
            /*console.log(
                `Invalid request, didn't respond.`
            )*/
        }
    }//End function()
)//End addListener()