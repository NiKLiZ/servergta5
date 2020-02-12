var f='write.txt',
    fs=require('fs');
function Init(file)
{
    f = file;
    fs.writeFile(f,'',function(err){
        if(err)
        console.error(err);
    });
}
function save(text)
{
    fs.appendFile(f, `${text}\r\n`, function(err){
        if(err)
        console.error(err);
        console.log('Add saved!');
    });
}
module.exports.save = save;
module.exports.Init = Init;
