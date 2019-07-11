/*
_  _ ____ ____ _ ____ ___  _    ____ ____
|  | |__| |__/ | |__| |__] |    |___ [__
 \/  |  | |  \ | |  | |__] |___ |___ ___]
 */
var rexy;
var GRAVITY = 1; // how fast rexy falls
var JUMP = 23; // how high rexy jumps
var score = 0; // score counter
var gameStartedTime = 0; // track how long each game lasts
var mouseIsClicked = false; // variable to make rexy jump on click/tap
var canJump = false;	// keep rexy from double jumping
var gameOver = false;
var gameOverButton; // variable for "restart" button
var platforms;
var platformSpawnInterval = 1400;
var lastPlatformSpawned = 0;
var offscreenLeft;	// destroy objects that go off left side
var offscreenBottom;	// destroy objects that go off bottom
var MIN_WORLD_SPEED = -10.0;	// how fast to buildings move? min
var MAX_WORLD_SPEED = -40.0;// max
var worldSpeed = MIN_WORLD_SPEED;	// current
var PLATFORM_HEIGHT = 30;
var PLATFORM_WIDTH = 500;


/*
____ _  _ _  _ ____ ___ _ ____ _  _ ____
|___ |  | |\ | |     |  | |  | |\ | [__
|    |__| | \| |___  |  | |__| | \| ___]
*/
function mousePressed() { // make rexy jump on click/tap
	if(canJump) {
		mouseisClicked = true;
		rexy.changeAnimation("jumping");
		rexy.velocity.y = -JUMP;
		canJump = false
	}
}
function restartGame() { // reset sketch to start a new game
	gameOver = false;
	platforms.removeSprites();
	gameOverButton.hide();
	setup();
	MIN_WORLD_SPEED = -10.0;
	worldSpeed = MIN_WORLD_SPEED;
	platform.velocity.x = worldSpeed;
	platformSpawnInterval = map(worldSpeed, MIN_WORLD_SPEED, MAX_WORLD_SPEED, 1400, 1400/3.6);
	updateSprites(true);
	lastPlatformSpawned = -1000;

}
function deleteBuilding(offscreenLeftCollider, buildingCollider) {
	buildingCollider.remove();
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
	rexy.animation.frameDelay = 2;
	bg = loadImage('img/backgroundEmpty.png');
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
	gameStartedTime = millis(); // start counting from this moment (FOR SCORE COUNTER)
	platforms = new Group(); 	// tell the sketch that platforms will be a collection of things
	var platform = createSprite(width / 3, height * .8, width, PLATFORM_HEIGHT); // (x,y,width, height)
	platform.velocity.x = worldSpeed; // speed of platforms
	platform.setCollider("rectangle", 0, 0, width, PLATFORM_HEIGHT);
	platform.shapeColor = color(random(0),random(),random(50,255));
	platforms.add(platform); 	// add to platforms group
	lastPlatformSpawned = -10000; 	// spawn one immediately, trick program into thinking it spawned one a long time ago
	offscreenLeft = createSprite(-width, height/2, 10, height); // (x,y,width, height)
	offscreenBottom = createSprite(width/2, height + 20, width, 10);
	// responsive
	mobileMax = 500;
	w = windowWidth;
	if (w < mobileMax) {
		rexy.position.x = 100;
		rexy.scale = .3;
		PLATFORM_HEIGHT = 30;
		PLATFORM_WIDTH = 500;
		lastPlatformSpawned = -200;
		platform.position.x = 400;
		platform.width = width*2;
		platform.setCollider("rectangle", 0, 0, width*2, PLATFORM_HEIGHT);
	}
}


/*
___  ____ ____ _ _ _
|  \ |__/ |__| | | |
|__/ |  \ |  | |_|_|
*/
function draw() {
	background(204,204,204); // background color of sketch canvas
	background(bg); // sets bg to image

	if(gameOver) {
		canJump = false;

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

		rexy.velocity.y += GRAVITY; // use gravity to push down when rexy jumps
		mouseisClicked = false; // (REFER TO FUNCTION: mousePressed) - makes rexy jump on click/tap

		if (millis() > lastPlatformSpawned + platformSpawnInterval) {
			var platformY = random(height*.5, height*.8);
			var platform = createSprite(width + PLATFORM_WIDTH / 2, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
			platform.velocity.x = worldSpeed;
			platform.setCollider("rectangle", 0, 0, PLATFORM_WIDTH, PLATFORM_HEIGHT);
			platform.shapeColor = color(random(0),random(0),random(50,255));;
			platforms.add(platform);
			lastPlatformSpawned = millis();
			worldSpeed = constrain(worldSpeed - .2, MAX_WORLD_SPEED, MIN_WORLD_SPEED); // increase speed of platforms going by
			platformSpawnInterval = map(worldSpeed, MIN_WORLD_SPEED, MAX_WORLD_SPEED, 1400, 1400/3.6); // increase frequency of platform spawns
			// platform.debug = true;
		}
		if (rexy.collide(platforms)) { // run when on top of a platform
			canJump = true; // touched a platform, now you can jump again
			rexy.changeAnimation("running");
			rexy.velocity.y = 0; // if on a platform, dont let gravity push down
		}
		if(rexy.collide(offscreenBottom) || rexy.position.x < 0) { // game ends if you fall off bottom or left side
			gameOver = true;
		}
		offscreenLeft.collide(platforms, deleteBuilding); // delete any offscreen platforms
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
