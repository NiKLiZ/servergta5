function alertEms(text){
	mp.fractions['EMS'].getOnlineMembers().forEach((pl)=>{
		pl.alert(text);
	});
}

module.exports.alertEms = alertEms;