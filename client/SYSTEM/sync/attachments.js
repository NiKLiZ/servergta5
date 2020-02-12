const weaponData = require("../../../packages/configs/weaponData");
mp.attachmentMngr = 
{
	attachments: {},
	
	addFor: function(entity, id)
	{
		try{

			if(this.attachments.hasOwnProperty && this.attachments.hasOwnProperty(id))
			{
				if(entity.__attachmentObjects && !entity.__attachmentObjects.hasOwnProperty(id))
				{
					let attInfo = this.attachments[id];
					let object = mp.objects.new(attInfo.model, entity.position,{
						dimension: -1
					});
					object.attachTo(entity.handle,
						(typeof(attInfo.boneName) === 'string') ? entity.getBoneIndexByName(attInfo.boneName) : entity.getBoneIndex(attInfo.boneName),
						attInfo.offset.x, attInfo.offset.y, attInfo.offset.z, 
						attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z, 
						false, false, false, false, 2, true);
					if(attInfo.toggle)attInfo.toggle(entity,true);
					entity.__attachmentObjects[id] = object;
				}
			}
			else
			{
				// mp.game.graphics.notify(`Static Attachments Error: ~r~Unknown Attachment Used: ~w~0x${id.toString(16)}`);
			}
		}catch(e){
			
		}
	},
	
	removeFor: function(entity, id)
	{
		try{

			if(entity.__attachmentObjects.hasOwnProperty && entity.__attachmentObjects.hasOwnProperty(id))
			{
				let obj = entity.__attachmentObjects[id];
				let attInfo = this.attachments[id];
				if(attInfo.toggle)attInfo.toggle(entity,false);
				delete entity.__attachmentObjects[id];
				
				if(mp.objects.exists(obj))
				{
					obj.destroy();
				}
			}
		}catch(e){}
	},
	
	initFor: function(entity)
	{
		try{
			for(let attachment of entity.__attachments)
			{
				mp.attachmentMngr.addFor(entity, attachment);
			}
		}catch(e){}
	},
	
	shutdownFor: function(entity)
	{
		try{
			for(let attachment in entity.__attachmentObjects)
			{
				mp.attachmentMngr.removeFor(entity, attachment);
			}
		}catch(e){}
	},
	
	register: function(id, model, boneName, offset, rotation,toggle)
	{
		try{
			if(typeof(id) === 'string')
			{
				id = mp.game.joaat(id);
			}
			
			if(typeof(model) === 'string')
			{
				model = mp.game.joaat(model);
			}
			
			if(!this.attachments.hasOwnProperty(id))
			{
				if(mp.game.streaming.isModelInCdimage(model))
				{
					this.attachments[id] =
					{
						id: id,
						model: model,
						offset: offset,
						rotation: rotation,
						boneName: boneName,
						toggle
					};
				}
				else
				{
					// mp.game.graphics.notify(`Static Attachments Error: ~r~Invalid Model (0x${model.toString(16)})`);
				}
			}
			else
			{
				mp.game.graphics.notify("Static Attachments Error: ~r~Duplicate Entry");
			}
		}catch(e){}
	},
	
	unregister: function(id) 
	{
		try{
			if(typeof(id) === 'string')
			{
				id = mp.game.joaat(id);
			}
			
			if(this.attachments.hasOwnProperty(id))
			{
				this.attachments[id] = undefined;
			}
		}catch(e){}
	},
	
	addLocal: function(attachmentName)
	{
		try{
			if(typeof(attachmentName) === 'string')
			{
				attachmentName = mp.game.joaat(attachmentName);
			}
			
			let entity = mp.players.local;
			
			if(!entity.__attachments || entity.__attachments.indexOf(attachmentName) === -1)
			{
				mp.events.callRemote("staticAttachments.Add", attachmentName.toString(36));
			}
		}catch(e){}
	},
	
	removeLocal: function(attachmentName)
	{
		try{
			if(typeof(attachmentName) === 'string')
			{
				attachmentName = mp.game.joaat(attachmentName);
			}
			
			let entity = mp.players.local;
			
			if(entity.__attachments && entity.__attachments.indexOf(attachmentName) !== -1)
			{
				mp.events.callRemote("staticAttachments.Remove", attachmentName.toString(36));
			}
		}catch(e){}
	},
	
	getAttachments: function()
	{
		try{
			return Object.assign({}, this.attachments);
		}catch(e){}
	}
};

mp.events.add("entityStreamIn", (entity) =>
{
	if(entity.__attachments)
	{
		mp.attachmentMngr.initFor(entity);
	}
});

mp.events.add("entityStreamOut", (entity) =>
{
	if(entity.__attachmentObjects)
	{
		mp.attachmentMngr.shutdownFor(entity);
	}
});

mp.events.addDataHandler("attachmentsData", (entity, data) =>
{
	let newAttachments = (data.length > 0) ? data.split('|').map(att => parseInt(att, 36)) : [];
	
	if(entity.handle !== 0)
	{
		let oldAttachments = entity.__attachments;	
		
		if(!oldAttachments)
		{
			oldAttachments = [];
			entity.__attachmentObjects = {};
		}
		
		// process outdated first
		for(let attachment of oldAttachments)
		{
			if(newAttachments.indexOf(attachment) === -1)
			{
				mp.attachmentMngr.removeFor(entity, attachment);
			}
		}
		
		// then new attachments
		for(let attachment of newAttachments)
		{
			if(oldAttachments.indexOf(attachment) === -1)
			{
				mp.attachmentMngr.addFor(entity, attachment);
			}
		}
	}
	
	entity.__attachments = newAttachments;
});

function InitAttachmentsOnJoin()
{
	mp.players.forEach(_player =>
	{
		let data = _player.getVariable("attachmentsData");
		
		if(data && data.length > 0)
		{
			let atts = data.split('|').map(att => parseInt(att, 36));
			_player.__attachments = atts;
			_player.__attachmentObjects = {};
		}
	});
}

InitAttachmentsOnJoin();

mp.attachmentMngr.register("boxWeapon", "prop_box_ammo04a", "BONETAG_R_PH_HAND", 
	new mp.Vector3(0,0, -0.03), new mp.Vector3(90, 0, 0),
	(entity,toggle)=>{
		global.isInSafeZone = toggle;
		mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), entity.handle, toggle ? 0 :  1, 1, 1, 1);
	}
);
mp.attachmentMngr.register("bagTrash", "bkr_prop_fakeid_binbag_01", "BONETAG_R_PH_HAND", 
	new mp.Vector3(0.6, 0.085, 0), new mp.Vector3(0, -90, 0),
	(entity,toggle)=>{
		mp.game.invoke(getNative("SET_PED_CURRENT_WEAPON_VISIBLE"), entity.handle, toggle ? 0 :  1, 1, 1, 1);
	}
);



const PistolAttachmentPos = new mp.Vector3(0.02, 0.06, 0.1);
const PistolAttachmentRot = new mp.Vector3(-100.0, 0.0, 0.0);

const SMGAttachmentPos = new mp.Vector3(0.08, 0.03, -0.1);
const SMGAttachmentRot = new mp.Vector3(-80.77, 0.0, 0.0);

const ShotgunAttachmentPos = new mp.Vector3(-0.1, -0.15, 0.11);
const ShotgunAttachmentRot = new mp.Vector3(-180.0, 0.0, 0.0);

const RifleAttachmentPos = new mp.Vector3(-0.1, -0.15, -0.13);
const RifleAttachmentRot = new mp.Vector3(0.0, 0.0, 3.5);

const weaponAttachmentData = {
    // Pistols
    "WEAPON_PISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_PISTOL_MK2": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_COMBATPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_APPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_STUNGUN": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_NIGHTSTICK": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation:  new mp.Vector3(-100.0, 0.0, 270) },
    "WEAPON_PISTOL50": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_SNSPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_SNSPISTOL_MK2": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_HEAVYPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_VINTAGEPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_REVOLVER": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_REVOLVER_MK2": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_DOUBLEACTION": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },
    "WEAPON_RAYPISTOL": { Slot: "RIGHT_THIGH", AttachBone: 51826, AttachPosition: PistolAttachmentPos, AttachRotation: PistolAttachmentRot },

    // Submachine Guns
    "WEAPON_MICROSMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_SMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_SMG_MK2": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_ASSAULTSMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_COMBATPDW": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_MACHINEPISTOL": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },
    "WEAPON_MINISMG": { Slot: "LEFT_THIGH", AttachBone: 58271, AttachPosition: SMGAttachmentPos, AttachRotation: SMGAttachmentRot },

    // Shotguns
    "WEAPON_PUMPSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_PUMPSHOTGUN_MK2": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_SAWNOFFSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_ASSAULTSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_BULLPUPSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },
    "WEAPON_HEAVYSHOTGUN": { Slot: "LEFT_BACK", AttachBone: 24818, AttachPosition: ShotgunAttachmentPos, AttachRotation: ShotgunAttachmentRot },

    // Rifles
    "WEAPON_ASSAULTRIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_ASSAULTRIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_CARBINERIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_CARBINERIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_SPECIALCARBINE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_SPECIALCARBINE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_MARKSMANRIFLE": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot },
    "WEAPON_MARKSMANRIFLE_MK2": { Slot: "RIGHT_BACK", AttachBone: 24818, AttachPosition: RifleAttachmentPos, AttachRotation: RifleAttachmentRot }
};

// Update weaponAttachmentData with attachment name and model
for (let weapon in weaponAttachmentData) {
    let hash = mp.game.joaat(weapon);

    if (weaponData[hash]) {
        weaponAttachmentData[weapon].AttachName = `WDSP_${weaponData[hash].HashKey}`;
        weaponAttachmentData[weapon].AttachModel = weaponData[hash].ModelHashKey;
    } else {
        console.log(`[!] ${weapon} not found in weapon data file and will cause issues, remove it from weaponAttachmentData.`);
    }
}
for (let weapon in weaponAttachmentData) mp.attachmentMngr.register(weaponAttachmentData[weapon].AttachName, weaponAttachmentData[weapon].AttachModel, weaponAttachmentData[weapon].AttachBone, weaponAttachmentData[weapon].AttachPosition, weaponAttachmentData[weapon].AttachRotation);