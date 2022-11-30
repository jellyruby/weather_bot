const https = require('https');
const { basename, dirname} = require('path');
const fs = require('fs');
const path = require('path');

const downloadFile = (url,callback) => {

    const filename = basename(url);
    const dirName ='C:/projects/weather/weather/myapp/src/assets/img/';
    const req = https.get(url,function(res){

            const fileStream = fs.createWriteStream(dirName+filename);

            res.pipe(fileStream);

            fileStream.on("error",function(err){
               
                console.log("error write to the stream.");
                console.log(err);

            });

            fileStream.on("close",function(){
                callback(dirName.filename);
            })

            fileStream.on("finish",function(){
                fileStream.close();
                console.log("Done");
            })

    });

    req.on("error",function(err){
        console.log("Error downloading the file.");
        console.log(err);

    });

}

module.exports.downloadFile = downloadFile;
