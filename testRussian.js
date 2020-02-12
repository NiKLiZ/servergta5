var path = require('path');
var fs = require('fs');
var async = require('async');


function getFiles (dirPath, callback) {

    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        var filePaths = [];
        async.eachSeries(files, function (fileName, eachCallback) {
            var filePath = path.join(dirPath, fileName);

            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    if (stat.isFile() && /\.js$/.test(filePath)) {
                        filePaths.push(filePath);
                    }

                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });

    });
}


getFiles('./packages', function (err, files) {
    let rusText = [];
    files.forEach(file => {
        let code = fs.readFileSync(file, 'utf8');
        let rus = /[А-ё]{1,}/ig;
        let text = code.match(rus);
        if(text){
           rusText.push(...text)
        }
    });
    console.log(rusText.length);
    fs.writeFile('rus.txt',rusText.join('\n'),function(err){
        if(err)
        console.error(err);
    });
});