var FMEServer = (function(){
    return {
        /**
         * upload data as transformworkspace data source
         * @param {url} url 
         * @param {headers} headers 
         * @param {data} data 
         */
        uploadData: function(url,headers,data){
            return axios.request({
                method:'POST',
                headers,
                url,
                data
            });

        },
        transformDownload: function(url,headers,params){
            return axios.request({
                method:'GET',
                headers,
                url,
                params
            })
        }

    }
})()