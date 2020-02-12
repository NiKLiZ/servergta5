let fs = global.require('fs');
let path = global.require('path');
let domain = require('domain');
let serverDomain = domain.create();
let async = require('async');
let walk = require('parallel-walker');
let folder = './packages/configs/';
let world = require('./mongodb/world.js').world;
let loadConfigsVehicles = require('./a/functions/vehicle/configsVehicles.js').load;

serverDomain.on('error',function (err) {
    console.error(err.message)
})

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(file => {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

mp.configs = {}
let loadConfigs = (callback)=>{
    let walker = walk.create();
    let files = [];
    let loadFiles = [];
	walker.on("file", function (file) {
		if(path.extname(file) == '.json'){
            files.push(file);
		}
	});
	walker.on("errors", function (error) {
		callback(error);
	});
	walker.on("end", function () {
        files.forEach((file,i)=>{
            fs.readFile(file, 'utf8', function (err, text) {
                if (err) throw err;
                try{
                    let data = JSON.parse(text);
                    let fileName = path.basename(file).replace(path.extname(file),'');
                    if(data.isglobal === false) return; 
                    data.save = ()=>{
                        let save = JSON.stringify(mp.configs[fileName]);
                        if(mp.configs[fileName].minemaized === false)save = JSON.stringify(mp.configs[fileName],null,4);
                        fs.writeFile(file, save, 'utf8', (err)=>{
                            console.log('Конфиг с названием '+fileName+' сохранён')
                        });
                    }
                    mp.configs[fileName] = data;
                    loadFiles.push(fileName)
                    if(loadFiles.length == files.length)callback();
                }catch(e){
                    console.error(e)
                }
            });
        });
	});
	walker.walk(folder);
}

let loadWorldModel = (callback)=>{
	world.find({},(err,done)=>{
		if(done.length == 0){
			let s = new world();
			s.save().cathch((err)=>{
				console.error(err)
			}).then((data)=>{
				add_world(data);
				callback(err)
			})
		}else{
			add_world(done[0])
			callback(err)
		}
	})
}
console.time('LoadServer')
async.parallel([
    loadConfigs,
    loadWorldModel,
    loadConfigsVehicles
],(err)=>{
	if(err)console.log(err)
    serverDomain.run(()=>{
        getDirectories('packages/server').forEach(src => {
            try {
				global.require('./packages/server/' + src);
            } catch (e) {
                console.error('Error: ' + e.stack);
            }
        });
        console.timeEnd('LoadServer')
    })
})

function add_world(model) {
	mp.world = Object.assign(mp.world,clone(model._doc));
	mp.world.model =  model;
}
function clone(obj) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;

	// Handle Date
	if (obj instanceof Date) {
	  copy = new Date();
	  copy.setTime(obj.getTime());
	  return copy;
	}

	// Handle Array
	if (obj instanceof Array) {
	  copy = [];
	  for (var i = 0, len = obj.length; i < len; i++) {
	      copy[i] = clone(obj[i]);
	  }
	  return copy;
	}

	// Handle Object
	if (obj instanceof Object) {
	  copy = {};
	  for (var attr in obj) {
	      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	  }
	  return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
}
process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});
const exit = async () => {
    process.exit(0);
};
process.on('exit', exit);
process.on('SIGHUP', exit);
process.on('SIGQUIT', exit);
process.on('SIGTERM', exit);
process.on('SIGINT', exit);
if (process.platform === 'win32') {
    process.on('SIGKILL', exit);
}