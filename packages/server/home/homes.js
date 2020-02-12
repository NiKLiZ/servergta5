let home = require('./class.js');
let homeModel = require('../mongodb/home.js').home
var homes = [];
homeModel.find({},(err, docs)=> {
	for(let i=0;i<docs.length;i++){
		try{
			homes.push(new home(i,new mp.Vector3(docs[i].pos.x,docs[i].pos.y,docs[i].pos.z),docs[i].type,docs[i].price,docs[i].owner,docs[i]));
		}catch(e){
			console.error(e);
		}
	}
});

module.exports = homes;