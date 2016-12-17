var babyObj = function()
{
	this.x;
	this.y;
	this.angle;
	this.babyEye = new Image();
	this.babyBody = new Image();

	this.babyTailTimer = 0;
	this.babyTailCount = 0;

	this.babyEyeTimer = 0;
	this.babyEyeCount = 0;
	this.babyEyeInterval = 1000;


	this.babyBodyTimer = 0;
	this.babyBodyCount = 0;
	this.babyBodyInterval = 1000;

}
babyObj.prototype.init = function()
{
	this.x = canWidth*0.5 - 50;
	this.y = canHeight*0.5 + 50;
	this.angle = 0;
	this.babyEye.src = "./src/babyEye0.png";
	this.babyBody.src = "./src/babyFade0.png";
}
babyObj.prototype.draw = function()
{

	//lerp x,y
	this.x = this.lerpDistance(mom.x, this.x, 0.98);
	this.y = this.lerpDistance(mom.y, this.y , 0.98);

	//delta angle
	var deltaY = mom.y - this.y;
	var deltaX = mom.x - this.x;
	var beta = Math.atan2(deltaY,deltaX) + Math.PI;

	this.angle = this.lerpAngle(beta,this.angle,0.6);

	//baby tail count
	this.babyTailTimer += deltaTime;
	if(this.babyTailTimer > 50) {
		this.babyTailCount = (this.babyTailCount + 1) % 8;
		this.babyTailTimer %= 50;
	}

	//baby eye count
	this.babyEyeTimer  += deltaTime;

	if(this.babyEyeTimer > this.babyEyeInterval) {
		this.babyEyeCount = (this.babyEyeCount + 1)%2 ;
		this.babyEyeTimer %= this.babyEyeInterval;

		 if(this.babyEyeCount == 0) {
		 	this.babyEyeInterval = Math.random() * 1500 + 2000;
		 }
		 else {
		 	this.babyEyeInterval = 200;
		 }
	}

	this.babyBodyTimer += deltaTime;
	if(this.babyBodyTimer > 300) {
		this.babyBodyCount = this.babyBodyCount + 1;
		this.babyBodyTimer %= 300;
		if (this.babyBodyCount > 19) {
			 this.babyBodyCount = 19;
			 data.gameover = true;
		}
	}


	ctx1.save();
	ctx1.translate(this.x, this.y);
	ctx1.rotate(this.angle);

	var babyTailCount = this.babyTailCount;

	ctx1.drawImage(babyTail[babyTailCount], - babyTail[babyTailCount].width*0.5+23 , - babyTail[babyTailCount].height*0.5);
    ctx1.drawImage(this.babyBody, -this.babyBody.width*0.5 , - this.babyBody.height*0.5);


    var babyBodyCount = this.babyBodyCount;
    ctx1.drawImage(babyBody[babyBodyCount], - babyBody[babyBodyCount].width*0.5 , - babyBody[babyBodyCount].height*0.5);

    var babyEyeCount = this.babyEyeCount;
 	ctx1.drawImage(babyEye[babyEyeCount],  - babyEye[babyEyeCount].width*0.5 , - babyEye[babyEyeCount].height*0.5);



    ctx1.restore();
}

babyObj.prototype.lerpDistance = function (aim, cur, ratio) 
{
	var delta = cur - aim;
	return aim + delta * ratio;
}

babyObj.prototype.lerpAngle = function(a, b, t) {
	var d = b - a;
	if (d > Math.PI) d = d - 2 * Math.PI;
	if (d < -Math.PI) d = d + 2 * Math.PI;
	return a + d * t;
}