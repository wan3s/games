"use strict";
			
var mouseX=0;
var mouseY=0;
var weight = 0;
var score = 0;
var tabl_cnt = 2;
var burgers_cnt = 5;
var max_score = 0;
var weight_normalize = 90;
var intervalID = 0;
var windowHeight = document.documentElement.clientHeight;
var windowWidth = document.documentElement.clientWidth;
var mainHeightKoef = 0.3;
var tabletsHeight = 50;
var burgersHeight = 50;
var burgers = [];
var tablets = [];
var off = 5;

var main = document.getElementById('patrick');
var mainTop = parseInt(main.style.top);
var mainLeft = parseInt(main.style.left);
var mainWidth = parseInt(main.offsetWidth);
var mainHeight = parseInt(main.offsetHeight);
var initDest = 20; //расстояние от main до препятствий при инициализации
var eps = 20;
var speed = 10;
var maxSpeed = 50;
var frames = 0;
var maxFrames = 1000;
var ro = 50;
var inc_koef = 5;
var lim = 15;
var requestID;

document.addEventListener("mousemove", refreshMouseCoords, false);
document.addEventListener("touchmove", refreshTouchCoords, false);
			
function init() {
	for (var i = 0; i < tabl_cnt; ++i){
		var tabId = "t" + i;
		var tabX = Math.random() * (windowWidth - initDest - mainWidth) + initDest + mainWidth;
		var tabY = Math.random() * (windowHeight - tabletsHeight);
		document.write('<img class="barrier" id="' + tabId + '" src="../img/tablet.png" alt="tablet" style="height: ' + tabletsHeight + '; width: auto; position:absolute; left:' + tabX + '; top: ' 
			+ tabY +'; z-index:' + (i + 2) + '">');
		tablets[i] = {elemId: tabId, x: tabX, y: tabY, height: tabletsHeight, addWeight: -1};
	}
	for (var i = 0; i < burgers_cnt; ++i){
		var burgerId = "b" + i;
		var burgerX = Math.random() * (windowWidth - initDest - mainWidth) + initDest + mainWidth;
		var burgerY = Math.random() * (windowHeight - burgersHeight);
		document.write('<img class="barrier" id="' + burgerId + '" src="../img/burger.png" alt="burger" style="height: ' + burgersHeight + '; width: auto; position:absolute; left:' + burgerX + '; top: ' 
			+ burgerY +'; z-index:' + (i + 2) + '">');
		burgers[i] = {elemId: burgerId, x: burgerX, y: burgerY, height: burgersHeight, addWeight: 1};
	}
	
	max_score = getCookie("max_score");
	
	if (max_score == undefined){
		document.cookie = "max_score=0;";
		max_score = 0;
	}

	animation();
}

function getCookie (name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function refreshMouseCoords() {
	mouseX=event.clientX;
	mouseY=event.clientY;
}

function refreshTouchCoords() {
	mouseX = event.touches[0].clientX;
	mouseY = event.touches[0].clientY;
}

function objectMove(){
	main.style.top = mouseY - mainHeight / 2;
	mainTop = parseInt(main.style.top);
}

function collisionHandler(array, n) {
	var i = 0;
	for (i = 0; i < n; i++){
		if ((array[i].x <= (mainWidth / 2) + off) && (array[i].y + array[i].height / 2 > mainTop) && (array[i].y + array[i].height / 2 < (mainTop + mainHeight))){
			weight += array[i].addWeight;
			write_weight.value = weight + weight_normalize + 'kg';
			score += 1;
			write_score.value = score;
			max_score = getCookie("max_score");
			if (max_score == undefined){
				max_score = 0;
			}
			if (max_score < score){
				max_score=score;
				document.cookie = "max_score=" + max_score;
			}
			write_max_score.value = max_score;
			main.style.width = mainWidth + inc_koef * array[i].addWeight + 'px';
			main.style.height = mainHeight + inc_koef * array[i].addWeight * (mainHeight/mainWidth) + 'px';
			if (weight > lim){
				location.href = '#openModal1';
				cancelAnimationFrame(requestId);
			}
			if (weight < (-1) * lim){
				location.href = '#openModal2';
				cancelAnimationFrame(requestId);
			}
			array[i].x = windowWidth;
			array[i].y = Math.random() * (windowHeight - array[i].height);
			document.getElementById(array[i].elemId).style.left = array[i].x;
			document.getElementById(array[i].elemId).style.top = array[i].y;
		}
	}
}

function moveBarriers(array, n) {
	var i = 0;
	for (i = 0; i < n; i++){
		if (document.getElementById(array[i].elemId).offsetLeft <= (-1) * document.getElementById(array[i].elemId).offsetWidth){
			array[i].x = windowWidth;
			array[i].y = Math.random() * (windowHeight - array[i].height);
		} else {
			array[i].x -= speed;
		}
	
		document.getElementById(array[i].elemId).style.left = array[i].x;
		document.getElementById(array[i].elemId).style.top = array[i].y;
		//main.style.height = mainHeightKoef * windowHeight + weight * (mainHeight/mainWidth);
	}

	frames += 1;
	if (frames >= maxFrames) {
		speed = Math.min(speed + 1, maxSpeed);
		frames = 0;
	}
}

function animation() {

	objectMove();

	mainTop = parseInt(main.style.top);
	mainLeft = parseInt(main.style.left);
	mainWidth = parseInt(main.offsetWidth);
	mainHeight = parseInt(main.offsetHeight);

	collisionHandler(burgers, burgers_cnt);
	collisionHandler(tablets, tabl_cnt);

	moveBarriers(burgers, burgers_cnt);
	moveBarriers(tablets, tabl_cnt);
	requestID = requestAnimationFrame(animation);
}

document.getElementById('write_weight').value = (weight + weight_normalize) + 'kg';
document.getElementById('write_max_score').value = max_score;

init();
		
