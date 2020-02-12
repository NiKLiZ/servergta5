let itemObject = null;
mp.events.add({
	"render":()=>{
		try{
			if(Looking && !player.vehicle){
				let secondPoint = Looking.position;
				let ob;
				mp.objects.forEach((object)=>{
					if(object.getVariable('isitem') && object.dimension == player.dimension  && mp.Vector3.Distance(secondPoint,object.position) < 1.2){
						ob = object;
					}
				})
				if(ob)mp.game.graphics.drawText(`E`,  [ob.position.x,ob.position.y, ob.position.z], {scale:0.2, color:[255, 255, 255, 255], font: 4});
				itemObject = ob;
			}
		}catch(e){}
	},
	"entityStreamIn": (entity) => {
		if (entity.type !== "object" || !entity.getVariable('isitem')) return;
		entity.placeOnGroundProperly();
	}
})
mp.events.addDataHandler({
	"isitem": (entity, value) => {
		if (entity.type !== "object") return;
		entity.placeOnGroundProperly();
	},
});
//E
mp.keys.bind(0x45,true,function(){
	if(!loggined || player.vehicle || !menuactive) return;
	if(itemObject){
		mp.events.callRemote("INVENTORY::TAKE_ITEM", itemObject.remoteId);
		itemObject = null;
	}
});