let player = mp.players.local;

mp.keys.bind(0x74, true, ()=>{
    
})



if(!mp.game.graphics.hasStreamedTextureDictLoaded("mpweaponsgang0"))
	mp.game.graphics.requestStreamedTextureDict("mpweaponsgang0", true);
while(!mp.game.graphics.hasStreamedTextureDictLoaded("mpweaponsgang0"))
	mp.game.wait(0);

//Create object for example
function CreateModel(model, pos, rot)
{
	if(!mp.game.streaming.hasModelLoaded(mp.game.joaat(model)))
		mp.game.streaming.requestModel(mp.game.joaat(model));
	while(!mp.game.streaming.hasModelLoaded(mp.game.joaat(model)))
		mp.game.wait(0);
	return mp.objects.new(mp.game.joaat(model), pos,
	{
		rotation: rot,
		alpha: 255,
		dimension: mp.players.local.dimension
	});
}

function CreateRenderTarget(name, model)
{
	if(!mp.game.ui.isNamedRendertargetRegistered(name))
		mp.game.ui.registerNamedRendertarget(name, false); //Register render target
	if(!mp.game.ui.isNamedRendertargetLinked(mp.game.joaat(model)))
		mp.game.ui.linkNamedRendertarget(mp.game.joaat(model)); //Link it to all models
	if(mp.game.ui.isNamedRendertargetRegistered(name))
		return mp.game.ui.getNamedRendertargetRenderId(name); //Get the handle
	return -1;
}

function RenderThings(id)
{
	mp.game.ui.setTextRenderId(id); //Set render ID of render target
	mp.game.graphics.set2dLayer(4); //Only layer 4 works
	
	mp.game.graphics.drawRect(0.5, 0.5, 1, 1, 255, 0, 0, 255); //Draw rect is always behind text/sprites
	
	mp.game.graphics.drawText("~b~west~w~", [0.5, 0.35], //Draw text is always the most top element
	{ 
	  font: 0, 
	  color: [255, 255, 255, 255], 
	  scale: [2.0, 2.0], 
	  outline: true
	});
	
	//Scaleforms work too although the majority have messed up scaling
	mp.game.graphics.drawScaleformMovie(scale, 0.5, 0.5, 1, 1, 255, 255,255, 255, 0);
	
	//Draw sprites. The layering for this is last drawn is the most top element
	mp.game.graphics.drawSprite("mpweaponsgang0", "w_ar_advancedrifle", 0.25, 0.5, 0.25, 0.25, 0, 255, 255, 255, 255);
	mp.game.graphics.drawSprite("mpweaponsgang0", "w_ex_grenadefrag", 0.25, 0.5, 0.25, 0.25, 0, 255, 255, 255, 255);
	
	mp.game.ui.setTextRenderId(1); //Do not forget to reset the render ID. 1 is always the default render target the game uses
}

var TargetsToRender = [];
var scale = 0;

mp.keys.bind(69, false, () => //Button E
{
	var pos = mp.players.local.position;
	pos.z += 1;
	
	scale = mp.game.graphics.requestScaleformMovie("cellphone_ifruit");
	while(!mp.game.graphics.hasScaleformMovieLoaded(scale))
		mp.game.wait(0);
	pos.z += 1;
	var x = CreateModel("des_tvsmash_start", pos, new mp.Vector3());
    var id = CreateRenderTarget("tvscreen", "des_tvsmash_start");
	if(id != -1)
		TargetsToRender.push(id);
	else
		mp.gui.chat.push("Could not create render target.");
});

mp.events.add("render", () =>
{
	for(var i = 0; i < TargetsToRender.length; i++)
	{
		RenderThings(TargetsToRender[i]);
	}
});