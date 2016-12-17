var aneObj = function() {

	//start point , control point,  end point(sin)
	this.rootx = []; // start
	this.headx = []; // end

	this.heady = [];


	this.x = [];
	this.len= [];
	this.alpha = 0;
	this.amp = [];

}
aneObj.prototype.num = 50;
aneObj.prototype.init = function() 
{

	for(var i = 0; i < this.num ; i++ ){
		this.rootx[i] = i*16 + Math.random()*20;
		this.headx[i] = this.rootx[i];

		this.heady[i] = canHeight - 280 + Math.random()*50;
		this.amp[i] = Math.random()*50 + 50;
	}

}
aneObj.prototype.draw = function(){


	this.alpha += deltaTime*0.0008;
	var l = Math.sin(this.alpha); [-1,1] 
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	for(var i = 0; i < this.num ; i++) {
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i],canHeight);// start point
		this.headx[i] = this.rootx[i] + l*this.amp[i];
		ctx2.quadraticCurveTo(this.rootx[i], canHeight - 100, this.headx[i], this.heady[i]);
		ctx2.lineWidth = 20;
		ctx2.lineCap = "round";
		ctx2.strokeStyle =  "#3b154e";
		ctx2.stroke();
	}

	ctx2.restore();
}