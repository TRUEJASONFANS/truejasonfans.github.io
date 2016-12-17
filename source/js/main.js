var canvas1;
var canvas2;

var ctx1;
var ctx2;

var lastTime;
var deltaTime;
var bgPic = new Image();
var canWidth;
var canHeight;
var ane;
var fruit;
var mom;
var mx;
var my;
var baby;

var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBodyOra = [];
var momBodyBlue = [];


var data;

var wave;

var halo;

var dust;
var dustPic = [];

document.body.onload = game;
function game() {


	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameloop();

}

function init() {
	//获得canvas context
	canvas1 = document.getElementById("canvas1");
	ctx1 = canvas1.getContext("2d");
	canvas2 = document.getElementById("canvas2");
	ctx2 = canvas2.getContext("2d");

	canvas1.addEventListener('mousemove',onMouseMove, false);

	bgPic.src = "./src/background.jpg";
	canWidth = canvas1.width;
	canHeight = canvas1.height;

	ane = new aneObj();
	ane.init();

	fruit = new fruitObj();
	fruit.init();

	mom = new fishMom();
	mom.init();

	baby = new babyObj();
	baby.init();

	mx = canWidth*0.5;
	my = canHeight*0.5;

	for(var i = 0; i< 8;i ++) {
		babyTail[i] = new Image();
		babyTail[i].src ="./src/babyTail" + i + ".png";
	}

	for(var i = 0; i < 2 ;i ++) {
		babyEye[i] = new Image();
		babyEye[i].src = "./src/babyEye" + i + ".png";		
	}

	for(var i = 0; i < 20 ;i ++) {
		babyBody[i] = new Image();
		babyBody[i].src = "./src/babyFade" + i + ".png";		
	}

	for(var i = 0; i < 8 ;i ++) {
		momTail[i] = new Image();
		momTail[i].src = "./src/bigTail" + i + ".png";		
	}

	for(var i = 0; i < 2 ;i ++) {
		momEye[i] = new Image();
		momEye[i].src = "./src/babyEye" + i + ".png";		
	}

	data = new dataObj();
	for(var i = 0; i < 8; i++) {
		momBodyOra[i] = new Image();
		momBodyBlue[i] = new Image();
		momBodyOra[i].src = "./src/bigSwim" + i + ".png";
		momBodyBlue[i].src = "./src/bigSwimBlue" + i + ".png";
	}
	wave = new waveObj();
	wave.init();

	halo = new haloObj();
	halo.init();

	for(var i = 0; i < 7 ; i++) {
		dustPic[i] = new Image();
		dustPic[i].src = "./src/dust" + i +".png";
	}
	dust = new dustObj();
	dust.init();

	ctx1.font = "30px Verdana";
	ctx1.textAlign = "center";


}

function gameloop() {
	window.requestAnimationFrame(gameloop);
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;

	if(deltaTime > 50) {
		deltaTime = 50;
	}

	drawBackground();
	ane.draw();
	fruitMonitor();
	ctx1.clearRect(0,0,canWidth,canHeight);
	fruit.draw();
	mom.draw();
	momFruitsCollision();
	momBabyCollision();
	baby.draw();
	data.draw();
	wave.draw();
	halo.draw();
	dust.draw();
} 

function onMouseMove(e){
	if(!data.gameover && (e.offSetX || e.layerX)) {
		mx = e.offSetX == undefined ? e.layerX:e.offSetX;
		my = e.offSetY == undefined ? e.layerY:e.offSetY;
	}
}