/* Should probably add a custom rules document so users can change how specific sites should react */
var customRules = {
    "medium.com": {
        article_urls: ".",
        article_class: "meteredContent",
        article_amount: -1
    },
    "www.guardian.com": {
        article_urls: "/.+\/articles\/.+/i",
        article_class: ".",
        article_amount: 1
    }
};
/* This hardcoded set is really just for testing purposes */


function convertUrl(originalUrl) {
    try {

        //originalUrl.toString().match(/^https{0,1}\:\/\/(\w+\.\w+)\/{0,1}.+$/gim);
        var customRuleset = customRules[originalUrl.hostname]
        var articleCount = document.getElementsByTagName("article")
        var matches = {
            "base":((originalUrl.href == `https://${originalUrl.hostname}/` || originalUrl.href == `https://${originalUrl.hostname}`) || originalUrl.pathname == "/"),
            "url":false,
            "class":false,
            "amount":false
        }

        if(!matches.base){
            if(undefined != customRuleset){
                matches.url = (originalUrl.pathname.toString().match(customRuleset.article_urls))
                matches.amount = (articleCount.length > customRuleset.article_amount || customRuleset.article_amount == -1)
                if(articleCount >= 1){
                    for(i=0;i<articleCount.length;i++){
                        matches.class = (matches.class || (articleCount[i].class.match(customRules.article_class)))
                    }
                }
            }
        }
        if(!matches.base && matches.url && matches.class && matches.amount){
            return `read://${originalUrl.href}`;
        }else{
            return null
        }
    } catch (e) {
        console.error('Invalid URL:', originalUrl);
        return null;
    }
}