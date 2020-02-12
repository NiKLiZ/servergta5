module.exports = `
try{
	function decoder(code, hash) {
		var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var decoded = '';
		var j = 0;
		
		var chr1, chr2, chr3,
			com1, com2, com3,
			enc1, enc2, enc3, enc4;
			
		code = code.slice(0,-2);
			
		for (var i=0; i<code.length;) {
			enc1 = b64chars.indexOf(code.charAt(i++));
			enc2 = b64chars.indexOf(code.charAt(i++));
			enc3 = b64chars.indexOf(code.charAt(i++));
			enc4 = b64chars.indexOf(code.charAt(i++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr1 -= j;
			com1 = chr1^b64chars.indexOf(hash.charAt(j));
			if(j===hash.length-1)j=0; else j++;
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr2 -= j;
			com2 = chr2^b64chars.indexOf(hash.charAt(j));
			if(j===hash.length-1)j=8; else j++;
			chr3 = ((enc3 & 3) << 6) | enc4;
			chr3 -= j;
			com3 = chr3^b64chars.indexOf(hash.charAt(j));
			if(j===hash.length-1)j=16; else j++;
			
			if(com1 !== 0) decoded = decoded + String.fromCharCode(com1);
			
			if (enc3 < 64 && com2 !== 0) decoded += String.fromCharCode(com2);
			if (enc4 < 64 && com3 !== 0) decoded += String.fromCharCode(com3);
		}
		return decoded;
	}
	var clientside;
	try{
		let code = require('./clientside.js')
		if(code)clientside = JSON.parse(decoder(code,'dsadsaDFfdAty536'));
	}catch(e) {
		mp.game.graphics.notify("error START")
	}
	if(clientside!=undefined){
		for (let i = 0; i < clientside.length; i++) {
			let c = decoder(clientside[i].code, clientside[i].hash);
			try{
				if(c.length>2)c = eval(c);
			}catch(e) {
					mp.game.graphics.notify("error "+e.stack)
					mp.game.graphics.notify("error "+ clientside[i].name)
			}
			if(clientside.length-1 === i) {
				global.clientsideLoaded=true;
			}
		}
	}
	clientside = undefined;
}catch(e){
	
}
`
