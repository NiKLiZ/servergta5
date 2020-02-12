var speedometr = {
	size: 250,
	padding: 50,
	startAngle_fuel: 50,
	endAngle_fuel: 140,
	fuelpadding: 12.5,
	Angle_speed: 130,
	speedUpdate: 100,
	lngsizi: 9,
	type_speed: 'KM/H',
	showFuel: true,
}

describeArcSpeed = function(x, y, r, startAngle, endAngle, continueLine, alter,isr2 = 1) {
  var end, start;
  start = polarToCartesian(x, y, r, startAngle %= 360);
  end = polarToCartesian(x, y, r, endAngle %= 360);
  return "" + (continueLine ? 'L' : 'M') + start.x + " " + start.y + " A" + r + " " + r + ", 0, " + isr2+ ", " + (alter ? 0 : 1) + ", " + end.x + " " + end.y;
};
describespeed = function(x, y, r, r2, startAngle, endAngle,isr2) {
 return (describeArcSpeed(x, y, r, startAngle, endAngle,false,false,isr2)) + " " + (describeArcSpeed(x, y, r2, endAngle, startAngle, true, true,isr2)) + "Z";
};

var speedometr_gui = class speedometr{
	constructor(conf) {
		this.size = conf.size;
		this.c = conf.size/2;
		this.punct = conf.Angle_speed;
		this.padding = conf.padding;
		this.endAngle_fuel = conf.endAngle_fuel;
		this.startAngle_fuel = conf.startAngle_fuel;
		this.fuelpadding = conf.fuelpadding;
		this.speedUpdate = conf.speedUpdate;
		this.type_speed = conf.type_speed;
		this.gear_number = 0;
		this.isFuel = true;
		this.backgroud = Snap(window.innerWidth,window.innerHeight).addClass('speedometr_backgroud_area');;
		this.areaBackgroud = this.backgroud.svg(window.innerWidth-(this.size+this.padding),window.innerHeight-(this.size+this.padding), this.size+this.padding, this.size+this.padding);
		this.paper = Snap(window.innerWidth,window.innerHeight).addClass('speedometr');
		this.area = this.paper.svg(window.innerWidth-(this.size+this.padding),window.innerHeight-(this.size+this.padding), this.size+this.padding, this.size+this.padding);
		this.areaBackgroud.circle(this.c,this.c,this.size/2).addClass('speedometr_backgroud');
		this.area.circle(this.c,this.c,this.size/2*0.95).addClass('speedometr-border');
		this.area.circle(this.c,this.c,this.size/2*0.70).addClass('speedometr-center');
		this.area.circle(this.c,this.c,this.size/2*0.65).addClass('speedometr-center-border');
		var g = this.area.gradient("l(0,0.5,1,1)#b8b8b8");
		// this.punct_path = this.area.path(describespeed(this.c, this.c,this.size/2*0.80,this.size/2*0.95, -this.punct,100)).addClass('speedometr-punct-line')
		$('body').append(`<canvas class="speedometr-canvas" style="top:   ${window.innerHeight-(this.size+this.padding)}px;left:${window.innerWidth-(this.size+this.padding)}px"></canvas>`)
		this.punct_path = $('.speedometr-canvas').attr({width: this.size+this.padding, height:this.size+this.padding }).get(0)

		this.area.path(describeArcSpeed(this.c,this.c,this.size/2*0.80,-130,this.punct)).addClass('speedometr-punct-line-border').attr({
			stroke: g
		});
		this.area.path(describespeed(this.c, this.c,this.size/2*0.90,this.size/2*0.95, -this.punct,this.punct)).addClass('speedometr-punct').attr({
			stroke: g
		})
		this.lngsizi = conf.lngsizi;
		for(let i=0;i<=this.lngsizi;i++){
			let angle = (this.punct*2 /this.lngsizi )*i-this.punct;
			let pos = polarToCartesian(this.c-8/2 , this.c, this.size/2*0.85, angle % 360);
			this.area.text(pos.x, pos.y, ""+i).addClass('speedometr-line')
			let start = polarToCartesian(this.c, this.c, this.size/2*0.95, angle %= 360);
  			let end = polarToCartesian(this.c, this.c, this.size/2*0.9, angle %= 360);
			this.area.path(`M${start.x} ${start.y}L${end.x} ${end.y}`).attr({
				    stroke: '#b8b8b8'
			});
		}
		$('body').append(`<div class="speedometr speedometr-km" style="width: ${this.size}px;bottom:${this.padding+130}px;right: ${this.padding}px;">54</div>`);
		this.km = $('.speedometr-km');
		$('body').append(`<div class="speedometr speedometr-gear" style="width: ${this.size}px;bottom: ${this.padding+60}px;right: ${this.padding}px"><span>D4</span></div>`);
		$('body').append(`<div class="speedometr speedometr-type" style="width: ${this.size}px;bottom: ${this.padding+100}px;right: ${this.padding}px"><span>${this.type_speed}</span></div>`);
		this.gear = $('.speedometr-gear').find('span');
		this.areaBackgroud.path(describespeed(this.c, this.c,this.size/2+this.fuelpadding+6,this.size/2+this.fuelpadding, this.startAngle_fuel,this.endAngle_fuel,0)).addClass('speedometr-background-fuel')
		// this.fuel = this.area.path(describespeed(this.c, this.c,this.size/2+this.fuelpadding+6,this.size/2+this.fuelpadding, 70,this.endAngle_fuel,0)).addClass('speedometr-fuel')
		this.speed = 1;
		this.contex = this.punct_path.getContext("2d");
		this.hide();
		if(!speedometr.showFuel)this.hideFuel();
		this.clearContex();
	}
	updateGear(gear){
		this.gear.html('D'+gear)
	}
	clearContex(){
		this.contex.clearRect(0, 0, this.size+this.padding, this.size+this.padding);
	}
	updateSpeed(speed,maxspeed = 400){
		this.updatePunct(speed,maxspeed)
		this.km.html(''+speed)
		this.speed = speed;
	}
	updateFuel(fuel,maxfuel){
		if(this.isFuel)this.updateFuel(fuel,maxfuel);
	}
	hide(){
		this.area.addClass('hide');
		this.backgroud.addClass('hide')
		$('.speedometr').hide();
		$('.speedometr-canvas').hide();
	}
	show(){
		this.area.removeClass('hide');
		this.backgroud.removeClass('hide');
		$('.speedometr').show();
		$('.speedometr-canvas').show();
	}
	destroy(){
		this.area.remove();
		this.areaBackgroud.remove();
		this.paper.remove();
		this.backgroud.remove();
		$('.speedometr').remove();
		$('.speedometr-canvas').remove();
	}
	updatePunct(speed,maxspeed){
		this.contex.beginPath();
		let startAngle = 2/360*(this.punct+10);
		let endAngle = 2/360*(180-(this.punct+10));
		let angle = (endAngle+2-startAngle)/maxspeed*speed+startAngle;
		let radius = this.size/2*0.95-this.size/2*0.80;
		this.contex.arc(this.c,this.c,this.c-radius+3,startAngle*Math.PI,angle*Math.PI,false);
		this.contex.strokeStyle = "#344491"
		this.contex.lineWidth = radius;
		this.contex.stroke()
	}
	updateFuel(fuel,maxfuel = 50){
		this.contex.beginPath();
		let startAngle = 2/360*(this.startAngle_fuel)
		let endAngle = 2/360*(100-(this.endAngle_fuel))
		let angle = (endAngle-startAngle)/maxfuel*fuel+startAngle;
		let radius = 6;
		this.contex.arc(this.c,this.c,this.c+this.fuelpadding+3,angle*Math.PI,startAngle*Math.PI,false);
		this.contex.strokeStyle = "#344491"
		this.contex.lineWidth = radius;
		this.contex.stroke()
	}
	showFuel(){
		this.isFuel = true;
		speedometr.showFuel = true;
		$('.speedometr-background-fuel').show();
		this.updateFuel(0);
	}
	hideFuel(){
		this.isFuel = false;
		speedometr.showFuel = false;
		$('.speedometr-background-fuel').hide();
		this.updateFuel(0);
	}
}
var speed = new speedometr_gui(speedometr);
