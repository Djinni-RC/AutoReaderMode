/* Should probably add a custom rules document so users can change how specific sites should react */
var GlobalCustomRules = {
    "medium.com": {
        article_urls: ".",
        article_class: "meteredContent",
        article_amount: -1,
    },
    "www.theguardian.com": {
        article_urls: '/article/.+/',
        article_class: ".",
        article_amount: 1,
    },
};
/* This hardcoded set is really just for testing purposes */


function convertUrl(webobj) {
    try {
        var oldurl = webobj.urlObject;
        var customRuleset = GlobalCustomRules[oldurl.hostname]
        var articleCount = webobj.domContent
        var matches = {
            "base":((oldurl.href == `https://${oldurl.hostname}/` || oldurl.href == `https://${oldurl.hostname}`) || oldurl.pathname == "/"),
            "url":false,
            "class":false,
            "amount":false
        }

        if(!matches.base){
            if(undefined != customRuleset){
                matches.url = (oldurl.pathname.toString().match(RegExp(customRuleset.article_urls,'gim')) && true)
                matches.amount = (!(articleCount.length > customRuleset.article_amount) || customRuleset.article_amount == -1)
                if(articleCount.length >= 1){
                    for(i=0;i<articleCount.length;i++){
                        for(z=0;z<articleCount[i].className.split(/\s/).length;z++){
                            matches.class = (matches.class || ((articleCount[i].classList[z].toString().match(RegExp(customRuleset.article_class))) && true))
                        }
                    }
                }
            }
        }

        if(!matches.base && matches.url && matches.class && matches.amount){
            webobj.ReaderPath = `read://${oldurl.href}`;
        }else{
            webobj.success = false
        }
        /*
        debug stuff :)
        console.log({
            oldurl:oldurl,
            customRuleset:customRuleset,
            articleCount:articleCount,
            matches:matches,
            webobj:webobj
        });
        */
        return webobj
    } catch (e) {
        console.error('Invalid URL:', e);
        console.error(webobj)
        return null;
    }
}