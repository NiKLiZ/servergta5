let ObjectId = (require('mongoose').Types.ObjectId);
String.prototype.trim=function(){return this.replace(/ /g, '').replace(/\n/g, '');};
String.prototype.toObjectId = function() {
	try{
  	return new ObjectId(this.toString());
  }catch(e){
  	return false;
  }
};
String.prototype.firstLetterCaps = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}