function convertUrl(originalUrl) {
    try {
        var isBase = originalUrl.toString().match(/^https{0,1}\:\/\/\w+\.\w+\/{0,1}$/gim);
        if(null == isBase){isBase = false}else{isBase = true}
        if(isBase){
            return `read://${originalUrl}`;
        }else{
            return originalUrl
        }
    } catch (e) {
        console.error('Invalid URL:', originalUrl);
        return null;
    }
}
