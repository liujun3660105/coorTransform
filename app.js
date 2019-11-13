var inputFile = $('#uploadfile');
var sourceFormat, transformType, DestFormat
function checkSelect() {
    sourceFormat = $('#sourceFormat').val();
    transformType = $('#transformType').val();
    DestFormat = $('#DestFormat').val();
    if (sourceFormat && transformType && DestFormat) {
        $('#uploadfile').attr('disabled', false);
    }
    if (sourceFormat === 'SHAPE') {
        $('#uploadfile').attr('accept', '.shp,.shx,.dbf');

    }
    else {
        $('#uploadfile').attr('accept', '.dwg');

    }
}

function dataUpload() {
    if($('a')){
        $('a').remove();
    }
    $(".loading").append("<img src='./assets/loading.gif'/>");
    // var img = document.createElement('img');
    // img.src='./assets/loading.gif'
    // $('.loading')
    var dataSource;
    var file = document.getElementById('uploadfile').files;
    var fileName = file[0].name.split('.')[0];
    var fileCounter = document.getElementById('uploadfile').files.length;
    var coorType = $('#transformType').val();
    var random = parseInt(Math.random() * 100000000);
    if (sourceFormat === 'SHAPE') {
        dataSource = '$(FME_SHAREDRESOURCE_SYSTEM)/temp/upload/DataTranslator/' + random + '/' + fileName + '.shp'
    }
    else {
        dataSource = '$(FME_SHAREDRESOURCE_SYSTEM)/temp/upload/DataTranslator/' + random + '/' + fileName + '.dwg'
    }
    var data = new FormData();
    for (var i = 0; i < fileCounter; i++) {
        var name = 'file' + i;
        data.append(name, file[i]);
    }

    var url = 'http://192.168.1.225:8083/fmerest/v3/resources/connections/FME_SHAREDRESOURCE_SYSTEM/filesys/temp/upload/DataTranslator/' + random + '/?createDirectories=true&overwrite=true';
    var headers = {
        'Authorization': 'fmetoken token=07bf2350b5a9a02e282e3b31d7b0a378c7fd4dcb',
        'Accept': 'application/json'
    }
    FMEServer.uploadData(url, headers, data).then((res) => {
        console.log(res)
        var url1 = 'http://192.168.1.225:8083/fmedatadownload/Tools/DataTranslator.fmw';
        // eac8c32946ced1775470550ae2a3354af1f6f633
        var headers1 = {
            'Authorization': 'fmetoken token=07bf2350b5a9a02e282e3b31d7b0a378c7fd4dcb',
            'Accept': 'application/json',
            'Content-Type': 'appplication/x-www-form-urlencoded'
        };
        var data1 = {
            SourceDataset_GENERIC: dataSource,
            SourceFormat: sourceFormat,
            TransformType: coorType,
            DestinationFormat: DestFormat,
            GENERIC_OUT_BASE_NAME_GENERIC: 'translate',
            opt_responseformat: 'json'
        };
        return FMEServer.transformDownload(url1, headers1, data1);
    }).then((res) => {
        if (res.status === 200) {
            $('.loading').empty();
            var a = document.createElement('a');
            a.innerHTML = '下载数据';
            a.setAttribute('href', res.data.serviceResponse.url);
            document.body.appendChild(a);
        }
    }).catch((err) => {
        var p = document.createElement('p');
        p.innerHTML= '出现错误';
        document.body.appendChild(p);
        console.log(err)
    });


    // $.ajax({
    //     type:'POST',
    //     headers:{
    //         'Authorization': 'fmetoken token=eac8c32946ced1775470550ae2a3354af1f6f633',
    //         'Accept':'application/json'
    //     },
    //     url:url,
    //     data:formData,
    //     contentType:false,
    //     processData: false,
    //     success:function(data){
    //         console.log(data);
    //         var dataSource = '$(FME_SHAREDRESOURCE_SYSTEM)\/temp\/upload\/DataTranslator\/'+random+'/'+fileName+'.shp'
    //      //    var dataSource = 'C:\\ProgramData\\Safe Software\\FME Server\\resources\\system\\temp\\upload\\DataTranslator\\'+random+'\\'+fileName+'.shp';
    //      // var dataSource = 'D:\\渤海院\\项目\\2019\\北辰停车专项\\适宜性评价\\data\\resultdata\\result_v1.shp';
    //      // var dataSource = '$(FME_DATA_REPOSITORY)/DataTranslator/'+random+'/'+fileName+'.shp'

    //         console.log(dataSource);
    //         var dataTrans = {
    //                 "publishedParameters":[
    //                     {
    //                          "name":"SourceDataset_GENERIC",
    //                          "value": [dataSource]
    //                     },
    //                     {
    //                         "name":"SourceFormat",
    //                         "value":'SHAPE'
    //                     },
    //                     {
    //                         "name":"COORDSYS",
    //                         "value":coorType
    //                     },
    //                     {
    //                         "name":"DestinationFormat",
    //                         "value":'ACAD'
    //                     },
    //                     {
    //                         "name":"GENERIC_OUT_BASE_NAME_GENERIC",
    //                         "value":'$translated_data1'
    //                     }
    //                     ]
    //             };
    //             $.ajax({
    //                 type:'GET',
    //                 headers:{
    //                  'Authorization': 'fmetoken token=eac8c32946ced1775470550ae2a3354af1f6f633',
    //                  'Accept':'application/json',
    //                  // 'Content-Type':'application/x-www-form-urlencoded'
    //                  // 'Content-Type':'application/json'
    //             },
    //                 url:'http://localhost/fmedatadownload/Tools/DataTranslator.fmw',
    //                 data:{
    //                  SourceDataset_GENERIC:[dataSource],
    //                  SourceFormat:'SHAPE',
    //                  COORDSYS:coorType,
    //                  DestinationFormat:'ACAD',
    //                  GENERIC_OUT_BASE_NAME_GENERIC:'translate',
    //                  opt_responseformat: 'json'
    //                 },
    //                 success:function(res){
    //                     console.log(res);
    //                 }
    //             })
    //      //    $.ajax({
    //      //        type:'POST',
    //      //        url:'http://localhost/fmerest/v3/transformations/transact/Tools/DataTranslator.fmw',
    //      //        headers:{
    //      //             'Authorization': 'fmetoken token=eac8c32946ced1775470550ae2a3354af1f6f633',
    //      //             'Accept':'application/json',
    //      //             // 'Content-Type':'application/x-www-form-urlencoded'
    //      //             'Content-Type':'application/json'
    //      //        },
    //      //        data:JSON.stringify(dataTrans),
    //      //     // data:{
    //      //     // SourceDataset_GENERIC: '$(FME_SHAREDRESOURCE_SYSTEM)/temp/upload/DataTranslator/'+random+'/'+fileName+'.shp',
    //      //     // SourceFormat: 'SHAPE',
    //      //     // COORDSYS: coorType,
    //      //     // DestinationFormat: 'ACAD'
    //      //     // },
    //      //        success:function(data){
    //      //         console.log(data);
    //      //         //    $.ajax({

    //      //         //        type:'POST',
    //      //         //        headers:{
    //      //         //         'Authorization': 'fmetoken token=eac8c32946ced1775470550ae2a3354af1f6f633',
    //      //         //         "Content-Type": "application/x-www-form-urlencoded",
    //      //         //         "Accept": "application/zip"
    //      //         //        },
    //      //         //        url:'http://localhost/fmerest/v3/resources/connections/FME_SHAREDRESOURCE_SYSTEM/downloadzip/temp',
    //      //         //        data:{
    //      //         //         folderNames:'engineresults',
    //      //         //         zipFileName:'resources.zip'
    //      //         //        },
    //      //         //        responseType:'blob',
    //      //         //        complete:function(xhr, data){
    //      //         //            console.log(xhr);
    //      //         //         console.log(xhr.getAllResponseHeaders());
    //      //         //            if(xhr.status===200){
    //      //         //             //    xhr.setHeader("Content-Disposition","attachment");
    //      //         //             // console.log(data);
    //      //         //             // xhr.AppendHeader('Content-Disposition','attachment;filename=resources.zip'); 
    //      //         //            }

    //      //         //        },
    //      //         //        success:function(res){
    //      //         //         //    console.log(res);
    //      //         //         //    data.setHeader("Content-Disposition","attachment");
    //      //         //         //    var blob = new Blob([data],{
    //      //         //         //     type:'application/zip'
    //      //         //         //    });
    //      //         //         //    var src = window.URL.createObjectURL(blob);
    //      //         //         //    window.URL.revokeObjectURL(blob);
    //      //         //         //    if(src){
    //      //         //         //        var a = document.createElement('a');
    //      //         //         //        a.innerHTML = '下载数据';
    //      //         //         //        a.setAttribute('href',src);
    //      //         //         //        a.setAttribute('download','result');
    //      //         //             //    let evObj = document.createEvent('MouseEvents');
    //      //         //             //     evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    //      //         //             //     a.dispatchEvent(evObj);
    //      //         //             //    document.body.appendChild(a);



    //      //         //        },
    //      //         //        error:function(err){
    //      //         //            console.log(err);
    //      //         //        }

    //      //         //    })

    //      //        },
    //      //        error:function(err){
    //      //            console.log(err);

    //      //        }

    //      //    })

    //     },
    //     error:function(err){
    //         console.log(err);
    //     }

    // })

}