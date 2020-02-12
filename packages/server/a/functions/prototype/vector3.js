mp.Vector3.prototype.dist = function (v2){
    let v1 = this;
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) + Math.pow((v2.y - v1.y),2)+Math.pow((v2.z - v1.z),2)));
}