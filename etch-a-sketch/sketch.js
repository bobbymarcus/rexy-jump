//dot to draw with
var marks = [];
var startPosition = false;
//etch a sketch
var board;
var inside;

//string of suggested drawings
var noun = ["dog", "cat", "girl", "boy", "flower", "tree", "house", +
"candy bar", "lollipop", "happy face", "building", "bed", "candle", +
"person", "bunny", "sandwich", "sad face", "pencil", "bird", "baby", "meme"];
var verb = [" on the beach", " on a table", " on a chair", " taking a trip", +
" on vacation", " riding a boat", " on the computer", " riding a coaster", +
" sitting on a shelf", " wearing a hat", " riding a skateboard", " playing cards", +
" riding a pony", " at school", " reading a book", " using the potty", +
" at work", " walking", " jumping", " climbing a mountain"];

function preload() {

	board = loadImage("assets/etch_a_sketch.png");
	bg = loadImage("assets/carpet.jpeg")
	//tried using a different font but it took too long to load.
	//space = loadFont("font/ShareTechMono-Regular.tff");
}

function setup() {

	createCanvas(windowWidth, windowHeight);
	background(255);
	background(bg);

	//random
	var ran1 = int(random(noun.length));
	var ran2 = int(random(verb.length));
	//drawing suggestion box
	fill(218,165,32);
	textAlign(CENTER, CENTER);
	textSize(30);
	textFont("helvetica");
	//textFont("space");
	text("Draw a " + noun[ran1] + verb[ran2], width/2, height - (height/15));
	text("Click anywhere in the grey drawing area to choose a start position" +
		", use arrow keys to draw.", width/2, 50)

	//drawing screen
	rectMode(CENTER);
	noStroke();
	fill(192, 192, 192);
	rect(width/2, height/2.11, 542, 386);
}

function draw() {

	//boundries for marker
	push();
	translate(width/2, height/2);
	//check if marker is within rectangle
	if (marks.x >= 271 || marks.x <= -271){
		marks.speed = 0;
	}
	if (marks.y >= 189 || marks.y <= -189) {
		marks.speed = 0;
	}
	pop();

	//call functions
	for(var i = 0; i < marks.length; i++) {
    	marks[i].update();
    	marks[i].display();
    	marks.splice(1, i)
    }

  	//etch-a-sketch
	imageMode(CENTER);
	image(board, width/2, height/2 );


}

function Marker() {

	this.x = mouseX;
	this.y = mouseY;
	this.speed = 1.0;

	this.update = function() {
	 	//key movement
	 	if(keyIsDown(UP_ARROW)) {
	 		this.y = this.y - this.speed;
	 	}

	 	if(keyIsDown(DOWN_ARROW)) {
	 		this.y = this.y + this.speed;
	 	}

	 	if(keyIsDown(LEFT_ARROW)) {
	 		this.x = this.x - this.speed;
	 	}

	 	if(keyIsDown(RIGHT_ARROW)) {
	 		this.x = this.x + this.speed;
	 	}
	}

	this.display = function() {
		noStroke();
		fill(60, 60, 60);
		ellipse(this.x, this.y, 2, 2);
	}
}

function mousePressed() {

	console.log;

	for (var i = 0; i < 1; i++) {
		marks.push(new Marker());
	}

}
