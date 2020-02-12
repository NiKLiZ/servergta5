let swapPoint = Date.now();
let currentPoint = swapPoint;

let nFps = 0;
let fps = 0;
mp.events.add('render', () => {
	try{
		if(player.permision && player.permision['ADMIN::MENU'] && mp.storage.data.setting.hud != false){
			let pos = player.position;
			mp.game.graphics.drawText(`X: ${pos.x.toFixed(2)} Y: ${pos.y.toFixed(2)} Z: ${pos.z.toFixed(2)} | R: ${player.getHeading().toFixed(2)}`,  [0.3, 0.9], {
				scale:0.15,
				color:[255, 255, 255, 255],
				font: 4
			});
		}
		if(!mp.storage.data.setting || !mp.storage.data.setting.fps) return;
		if(currentPoint - swapPoint <= 1000)
		{
			nFps++;
			currentPoint = Date.now();
		}
		else
		{
			fps = nFps;
			nFps = 0;
			swapPoint = Date.now();
		}
		mp.game.graphics.drawText(''+fps, [0.01, 0], { 
			font: 2, 
			color: [0, 120, 10, 255], 
			scale: [0.6, 0.6], 
			outline: true
		});
	}catch(e){}

});