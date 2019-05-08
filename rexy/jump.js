/*
_  _ ____ ____ _ ____ ___  _    ____ ____
|  | |__| |__/ | |__| |__] |    |___ [__
 \/  |  | |  \ | |  | |__] |___ |___ ___]
 */
var rexy;
var GRAVITY = 1; // how fast rexy falls
var JUMP = 15; // how high rexy jumps
var ground;
var leftSideScreen; // sprite/collider for left side of screen so objects that go off left side get deleted
var obstacles; // create variable to refer to obstacles group
var spawnObstacleInterval = 300;	// how often new obstacles spawn
var lastSpawnTime;	// keep track of the last osbtacle spawn
var score = 0; // score counter
var gameStartedTime = 0; // track how long each game lasts
var mouseIsClicked = false; // variable to make rexy jump on click/tap
var gameOver = false;
var gameOverButton; // variable for "restart" button


/*
____ _  _ _  _ ____ ___ _ ____ _  _ ____
|___ |  | |\ | |     |  | |  | |\ | [__
|    |__| | \| |___  |  | |__| | \| ___]
*/
function mousePressed() { // make rexy jump on click/tap
	mouseisClicked = true;
	rexy.changeAnimation("jumping");
	rexy.velocity.y = -JUMP;
}
function deleteObstacle(col1, col2) { // delete obstacles that go off left side of screen
	col2.remove();
}
function hitObstacle(collider1, collider2) { // if rexy collides with obstacle -> game over
	gameOver = true;
	collider2.velocity.x = 0; // remove obstacle that rexy collided with
}
function restartGame() { // reset sketch to start a new game
	gameOver = false;
	obstacles.removeSprites();
	gameOverButton.hide();
	setup();
}


/*
___  ____ ____ _    ____ ____ ___
|__] |__/ |___ |    |  | |__| |  \
|    |  \ |___ |___ |__| |  | |__/
*/
function preload() {
	// create a rexy sprite
	rexy = createSprite();
	rexy.addAnimation("running", "img/rexy-pixelated/rexy_00000.png", "img/rexy-pixelated/rexy_00008.png");
	rexy.addAnimation("jumping", "img/rexy-pixelated/rexyjump.png");
	rexy.scale = .4;
	rexy.animation.frameDelay = 4;
	// load fonts
	fontMed = loadFont('fonts/BarlowCondensed-Medium.ttf');
	fontBold = loadFont('fonts/BarlowCondensed-Black.ttf');
}


/*
____ ____ ___ _  _ ___
[__  |___  |  |  | |__]
___] |___  |  |__| |
*/
function setup() {
	createCanvas(windowWidth, windowHeight);
	rexy.position.x = width/5; 	// rexy's starting position
	rexy.position.y = height/2; 	// rexy's starting position
	ground = createSprite(width/2, height - 10, width, height/2); // (x, y, width. height)
	ground.shapeColor = 224, 224, 224;
	leftSideScreen = createSprite(0, height/2, 0, height); // (x, y, width. height)
	obstacles = new Group(); 	// tell the sketch that obstacles will be a collection of things
	lastSpawnTime = millis(); // start counting from this moment (FOR OBSTACLE SPAWNS)
	gameStartedTime = millis(); // start counting from this moment (FOR SCORE COUNTER)
}


/*
___  ____ ____ _ _ _
|  \ |__/ |__| | | |
|__/ |  \ |  | |_|_|
*/
function draw() {
	background(204,204,204); // background color of sketch canvas

	/* -+-+-+ +-+-+-+-+
  |G|A|M|E| |O|V|E|R|
  +-+-+-+-+ +-+-+-+ */
	if(gameOver) {
		if(!gameOverButton){ // create button to restart game
			gameOverButton = createButton('TRY AGAIN');
		}
		  gameOverButton.style('display', 'block');
			gameOverButton.mousePressed(restartGame);

		fill(0,0,0);
		textAlign(CENTER);
		textFont(fontBold);
		textSize(100);
		text("YOU LOSE", width/2, height/2);
		textFont(fontMed);
		textSize(30);
		text("YOU LASTED " + score + " SECONDS", width/2, height/2 + 50);
	} //if(gameOver)

	/* +-+-+-+-+-+-+
  |P|L|A|Y|I|N|G|
  +-+-+-+-+-+-+ */
	else {
		drawSprites(); // needed for p5.play to work - (updates all your sprite objects)

		score = int((millis() - gameStartedTime) / 1000) // score = how many seconds you're alive
			fill(0,0,0);
			textAlign(LEFT);
			textFont(fontBold);
			textSize(30);
			text("SCORE", 30, 50);
			textSize(50);
			text(score, 30, 100);

		mouseisClicked = false; // (REFER TO FUNCTION: mousePressed) - makes rexy jump on click/tap
		rexy.velocity.y += GRAVITY; // use gravity to push down when rexy jumps
		if (rexy.collide(ground)) { // make rexy run when on the ground
			rexy.changeAnimation("running");
			rexy.velocity.y = 0;
		}

		if(millis() > lastSpawnTime + spawnObstacleInterval) { // logic for spawning obstacles
			var newSprite = createSprite(width, random(height/1.5), 40, 40); // spawn new obstacle
			newSprite.addAnimation("obstacle", "img/coach.png"); // add image to the variable newSprite called "obstacle"
			newSprite.scale = 1.5; 	// scale "obstacle" image
			newSprite.setCollider("rectangle",0, 0, 30, 20); // set the bounding box of obstacle
			newSprite.velocity.x = -12; // speed that the obstacles move at
			obstacles.add(newSprite); // add newSprite to the group "obstacles"
			lastSpawnTime = millis(); // reset timer every time a new obstacle spawns
			newSprite.debug = false; // (for debugging) - show bounding box
		}
		rexy.overlap(obstacles, hitObstacle); // if rexy overlaps with anything in obstacles group -> call hitObstacle function
		leftSideScreen.overlap(obstacles, deleteObstacle); // if obstacles hit left side of screen -> call deleteObstacle function
	} //else
} //draw











/*
____ ____ _  _ ____ ___     ____ _  _ _ ___  ___  ____ ___ ____
[__  |__| |  | |___ |  \    [__  |\ | | |__] |__] |___  |  [__
___] |  |  \/  |___ |__/    ___] | \| | |    |    |___  |  ___]
*/

// PAUSE BUTTON
	// put in "setup" function to add pause button
				// button = createImg('');
				// button.mousePressed(pauseGame);
	// put in "functions" setup
				// function pauseGame() {
				//
				// }

// SETTING INPUTS
	// if (keyWentDown("space")) {
	// 	rexy.changeAnimation("jumping");
	// 	rexy.velocity.y = -JUMP;
	// }

	// if(keyWentDown('space') || mouseWentDown(LEFT))
	// 	restartGame();
