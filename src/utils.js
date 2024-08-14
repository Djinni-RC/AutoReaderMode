function convertUrl(originalUrl) {
    try {
        if (originalUrl.startsWith('read://')) {
            return originalUrl;
        }

        const urlObject = new URL(originalUrl);
        var isBase = urlObject.toString().match(/^https{0,1}\:\/\/\w+\.\w+\/{0,1}$/gim);
        if(null == isBase){isBase = false}else{isBase = true}
        if(isBase){

            const domain = urlObject.hostname;
            const baseUrl = `read://https_${domain}/?url=`;
            const encodedUrl = encodeURIComponent(originalUrl);
            const readerUrl = baseUrl + encodedUrl;
            
            console.log(`Converted ${originalUrl} to ${readerUrl}`);
            
            return readerUrl;
        }else{
            return originalUrl
        }
    } catch (e) {
        console.error('Invalid URL:', originalUrl);
        return null;
    }
}
