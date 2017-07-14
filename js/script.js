var buttons = [];
var minePositions=[];
var hasStarted=false;
var openedCell = [];
var contentInCell = [];
var flaggedCell = [];
var questionedCell=[];
var selectedCell = [];
var noOfMines = 10;
var noOfRows = 10;
var noOfCols = 10;
var time = "00:00:00";
var timer = null;
var highScore = null;
var mode = "beginner";
var generateGrid = function(){
	var gameArea = $('.gamearea');
	if(noOfCols*25 < 375)
		gameArea.parent().css("width","375px");
	else
		gameArea.parent().css("width",noOfCols*25+"px");
	for(var i=0;i<noOfRows;i++){
		var row = $('<div>')
		$(row).addClass('single-row');
		var tempArray = [];
		for(var j=0;j<noOfCols;j++){
			var btn =$('<button>');
			$(btn).data("x",i)
			$(btn).data("y",j)
			$(btn).click(clickFunction);
			$(btn).on("contextmenu",rightClick);
			$(row).append(btn);
			tempArray.push(btn);
		}
		$(gameArea).append(row);
		buttons.push(tempArray);
	}
}
var clickFunction = function(){
	var clickedX = $(this).data('x');
	var clickedY = $(this).data('y');
	if(isAlready(clickedX,clickedY,flaggedCell) || isAlready(clickedX,clickedY,openedCell)){
		return;
	}
	if(isAlready(clickedX,clickedY,questionedCell)){
		removeEntry(clickedX,clickedY,questionedCell);
		$(this).css("background-image","none");
		return;
	}
	if(isAlready(clickedX,clickedY,minePositions)){
		gameOver();
		return;
	}
	if(hasStarted == false){
		hasStarted = true;
		timer=setInterval(timeFunction,1000);
		selectedCell.push([clickedX,clickedY]);
		$(this).css("background-image","url(./images/open.png)");
		placeMine();
		
	}
	openCells(clickedX,clickedY);
	if(openedCell.length == noOfRows*noOfCols - noOfMines){
		win();
	}
}
var win = function(){
	for(var i=0;i<minePositions.length;i++){
		buttons[minePositions[i][0]][minePositions[i][1]].css("background-image","url(./images/mine-close.png)");
	}
	clearInterval(timer);
	timer=null;
	$("#reset").css("background-image","url(./images/solved.png)");
	$("#remMine").text("0")
	isHighScore();
}
var openCells = function(x,y){
	if(x<0 || y<0 || x>noOfRows-1 || y>noOfCols-1){
		return;
	}
	if(isAlready(x,y,openedCell) || isAlready(x,y,flaggedCell)){
		return;
	}
	openedCell.push([x,y]);
	buttons[x][y].css("background-image","url(./images/open.png)");
	if(contentInCell[x][y]>0){
		//buttons[x][y].css("background-image",backgroundImages[contentInCell[x][y]-1]);
		buttons[x][y].css("background-image","url(./images/open.png)");
		buttons[x][y].text(contentInCell[x][y]);
		return;
	}
	var tempArray = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
	for(var i=0;i<tempArray.length;i++){
		var temX = x-tempArray[i][0];
		var temY = y-tempArray[i][1];
		openCells(temX,temY);
	}
	return;
}
var gameOver = function(){
	for(var i=0;i<minePositions.length;i++){
		buttons[minePositions[i][0]][minePositions[i][1]].css("background-image","url(./images/mine-open.png)");
	}
	clearInterval(timer);
	timer=null;
	$("#reset").css("background-image","url(./images/sad.png)")
}
var rightClick = function(e){
	e.preventDefault();
	var clickedX = $(this).data('x');
	var clickedY = $(this).data('y');
	if(isAlready(clickedX,clickedY,openedCell)){
		return;
	}
	if(isAlready(clickedX,clickedY,questionedCell)){
		removeEntry(clickedX,clickedY,questionedCell);
		buttons[clickedX][clickedY].css("background-image","url(./images/close.png)");
		return;
	}
	if(isAlready(clickedX,clickedY,flaggedCell)){	
		removeEntry(clickedX,clickedY,flaggedCell);
		questionedCell.push([clickedX,clickedY]);
		buttons[clickedX][clickedY].css("background-image","url(./images/question.png)");
		return;
	}
	flaggedCell.push([clickedX,clickedY]);
	buttons[clickedX][clickedY].css("background-image","url(./images/flag.png)");
	$("#remMine").text(noOfMines - flaggedCell.length);
	/*if(flaggedCell.length == 10){
		checkFlags();
	}*/
}
var checkFlags = function(){
	var s=0;
	for(var i=0;i<flaggedCell.length;i++){
		for(var j=0;j<minePositions.length;j++){
			if(flaggedCell[i][0] == minePositions[j][0] && flaggedCell[i][1] == minePositions[j][1]){
				s++;
				break;
			}
		}
	}
	if(s==noOfMines){
		win();
	}
}
var removeEntry = function(x,y,cell){
	for(var i=0;i<cell.length;i++){
		if(cell[i][0] == x && cell[i][1] == y){
			cell.splice(i,1);
		}
	}
}
var isAlready = function(x,y,cell){
	for(var i=0;i<cell.length;i++){
		if(cell[i][0] == x && cell[i][1] == y){
			return true;
		}
	}
	return false;
}
var minePositionChecker = function(array,x,y){
	var selectedCellX = selectedCell[0][0];
	var selectedCellY = selectedCell[0][1];
	if($.grep(array,function(a){return (x==a[0] && y==a[1]) || (selectedCellX==x && selectedCellY==y);}).length>0){
		return true;
	}
	var tempArray = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
	for(var i=0;i<tempArray.length;i++){
		var temX = selectedCellX-tempArray[i][0];
		var temY = selectedCellY-tempArray[i][1];
		if(temX==x && temY==y){
			return true;
		}
	}
	return false;
}
var calculateNumberOnCell = function(){
	var array = [];
	for(var i=0;i<noOfRows;i++){
		array[i]=new Array(noOfCols);
		for(var j=0;j<noOfCols;j++){
			array[i][j]=calculateNumberOfMine(i,j);
			if(array[i][j]>3){
				console.log(array[i][j]);
			}
		}
	}
	contentInCell = array;
}
var calculateNumberOfMine = function(x,y){
	var tempArray = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
	var no=0;
	for(var i=0;i<minePositions.length;i++){
		var singleMine = minePositions[i];
		if(singleMine[0]==x && singleMine[1]==y){
			return -1;
		}
		for(var l=0;l<tempArray.length;l++){
			var temX = x-tempArray[l][0];
			var temY = y-tempArray[l][1];
			if(temX == singleMine[0] && temY == singleMine[1]){
				no++;
			}
		}
	}
	return no;
}
var placeMine = function(){
	var array=[];
	for(var i=0;i<noOfMines;i++){
		var x=0;
		var y=0;
		do{
			x=Math.floor(Math.random() * noOfRows);
			y=Math.floor(Math.random() * noOfCols);
		}while(minePositionChecker(array,x,y));
		array.push([x,y]);
	}
	minePositions = array;
	calculateNumberOnCell();
}
var init = function(){
	buttons = [];
	minePositions=[];
	hasStarted=false;
	openedCell = [];
	contentInCell = [];
	flaggedCell = [];
	questionedCell=[];
	selectedCell = [];
	if(timer != null){
		clearInterval(timer);
	}
	timer = null;
	time = [0,0,0];
	$(".gamearea").html("");
	$("#remMine").text(noOfMines - flaggedCell);
	$("#timeTaken").text(renderTimer(time));
	$("#reset").css("background-image","url(./images/happy.png)");
	$("#highScore").text(renderTimer(highScore[mode]));
}
var timeFunction = function(){
	time[2]++;
	if(time[2] == 60){
		time[1]++;
		time[2]=0;
	}
	if(time[1] == 60){
		time[0]++;
		time[1]=0;
	}
	$("#timeTaken").text(renderTimer(time));
}
var renderTimer = function(timeArray){
	return twoDigitMaker(timeArray[0]) + ":" +twoDigitMaker(timeArray[1]) + ":" + twoDigitMaker(timeArray[2]);
}
var twoDigitMaker = function(num){
	return num.toString().length>1 ? num : "0"+num;
}
var isHighScore = function(){
	var thighScore = highScore[mode];
	if(thighScore[0]<time[0] || thighScore[1]<time[1] || thighScore[2]<time[2]){
		return false;
	}
	highScore[mode]=time;
	$("#highScore").text(renderTimer(highScore[mode]));
	return true;
}
var fetchHighScore = function(){
	highScore = JSON.parse(localStorage.getItem("mineSweeper_highScore"));
	if(highScore == undefined){
		highScore = {"beginner":[0,0,0],"intermediate":[0,0,0],"expert":[0,0,0]};
	}
}
var saveHighScore = function(){
	localStorage.setItem("mineSweeper_highScore",JSON.stringify(highScore));
}
var reset = function(){
	init();
	generateGrid();
}
$(document).ready(function(){
	fetchHighScore();
	init();
	generateGrid();
	$("#reset").click(reset);
});