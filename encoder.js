'use strict';
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through2');
var File = require('vinyl');
var path = require('path');

module.exports = (file,hash,var_code,is_require,end_code = '') => {
	let codes = [];
	var latestFile;
	let bufferContents = function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-example-plugin', 'Streaming not supported'));
      return;
    }

    try {
    	let data
    	if(is_require) data = file.contents.toString().replace(/require\((.*?)\);/,'');
      else data = file.contents.toString();
			latestFile = file;
			let hash = randomhash(30);
			codes.push({
				hash: hash,
				code: encoder(data,hash),
				name: file.path.replace(__dirname,'')
			});
    } catch (err) {
      this.emit('error', new PluginError('gulp-encoder-rage', err));
    }

		cb();
  }
  let endStream = function(cb) {
	var joinedFile;
    try {
		if (typeof file === 'string') {
		  joinedFile = latestFile.clone({contents: false});
		  joinedFile.path = path.join(latestFile.base, file);
		} else {
		  joinedFile = new File(file);
		}
		let cods = JSON.stringify(codes);
		joinedFile.contents = new Buffer.from(""+var_code  +" = '"+encoder(cods,hash)+"'"+end_code);
		this.push(joinedFile);
    } catch (err) {
      this.emit('error', new PluginError('gulp-example-plugin', err));
    }

    cb();
  };
  return through.obj(bufferContents, endStream);
};



function encoder(code, hash) {
	
	code = code.replace(/[\u0080-\uFFFF]/g, function (s) {
        return "\\u" + ('000' + s.charCodeAt(0).toString(16)).substr(-4);
    });
	
	var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var encoded = '';
	var j = 0;
	
	var chr1, chr2, chr3,
		com1, com2, com3,
		enc1, enc2, enc3, enc4;
		
	for (var i=0; i<code.length;) {
		chr1 = code.charCodeAt(i++);
		chr2 = code.charCodeAt(i++);
		chr3 = code.charCodeAt(i++);

		com1 = (chr1^b64chars.indexOf(hash.charAt(j)));
		com1 += j;
		if(j===hash.length-1)j=0; else j++;
		com2 = (chr2^b64chars.indexOf(hash.charAt(j)));
		com2 += j;
		if(j===hash.length-1)j=8; else j++;
		com3 = (chr3^b64chars.indexOf(hash.charAt(j)));
		com3 += j;
		if(j===hash.length-1)j=16; else j++;

		enc1 = com1 >> 2;
		enc2 = ((com1 & 3) << 4) | (com2 >> 4);
		enc3 = isNaN(com2) ? 64:(((com2 & 15) << 2) | (com3 >> 6));
		enc4 = isNaN(com3) ? 64:(com3 & 63);
		
		encoded += b64chars.charAt(enc1) + b64chars.charAt(enc2) + b64chars.charAt(enc3) + b64chars.charAt(enc4);
	}
	return encoded+"==";
}
function randomhash(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
