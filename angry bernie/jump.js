
//animations like p5 images should be stored in variables
//in order to be displayed during the draw cycle
var bernie;

// singular sprite/collider to stand on
var ground;

// sprite/collider for left side of screen
// so objects that go off left side get deleted
var leftSideScreen;

// create variable to refer to obstacles
var obstacles;
// how often do i want obstacles to spawn?
var spawnObstacleInterval = 500;	// half second
var lastSpawnTime;	// keep track of the last time spawn happened

// a few global parameters we can freely adjust
var GRAVITY = 1;
var JUMP = 15;

// score counter
var score = 0;
var endingScore = 0;

// is it game over?
var gameOver = false;

//it's advisable (but not necessary) to load the images in the preload function
//of your sketch otherwise they may appear with a little delay
function preload() {

	// create a bernie sprite and give it an arbitrary starting position,
	// we will change that later
	bernie = createSprite();
	// give him a couple animation types and specify where the files exist
	bernie.addAnimation("running", "assets_jump/bernie-walk-0.png", "assets_jump/bernie-walk-3.png");
	bernie.addAnimation("jumping", "assets_jump/bernie-jump.png");
	// he's too big so scale him down to 30%
	bernie.scale = .3;
	// he runs too fast so put 6 frames between each image in sprite animation
	bernie.animation.frameDelay = 6;
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// adjust bernie position
	bernie.position.x = width / 4;
	bernie.position.y = height - 100;

	// just make a plain old "sprite" for the ground
	// sprites draw from their center, so start at width/2
	ground = createSprite(width / 2, height - 10, width, 10);

	// tell the sketch that obstacles will be a 
	// collection of things
	obstacles = new Group();

	// if hit left side screen delete object
	leftSideScreen = createSprite(0, height/2, 10, height);

	// start counting from this moment (for spawns)
	lastSpawnTime = millis();

}

function draw() {
	background(80);

	// did the game end?
	if(gameOver) {
		fill(255,255,0);
		text("GAME OVER", width/2, height/2);
		text("you lasted " + endingScore + " seconds", width/2, height/2 + 20);

	} else {

		// game still going, do stuff!

		// score is how long youre alive
		score = millis()/1000;

		// show score in yellow
		fill(255,255,0);
		text("you have survived for " + int(score) + " seconds", 10, 10);

		// gravity push down!
		bernie.velocity.y += GRAVITY;

		// did bernie collide with the singular ground object?
		if (bernie.collide(ground)) {
			bernie.changeAnimation("running");
			bernie.velocity.y = 0;
		}

		// if jump
		if (keyWentDown("x") || mouseWentDown(LEFT)) {
			bernie.changeAnimation("jumping");
			bernie.velocity.y = -JUMP;
		}

		// spawn obstacles logic
		if(millis() > lastSpawnTime + spawnObstacleInterval) {
			// spawn new obstacle
			var newSprite = createSprite(width, random(height), 20, 20);

			// set the bounding box
			newSprite.setCollider("rectangle", 0, 0, 20, 20);

			// give it a negative speed to go from right to left
			newSprite.velocity.x = -7;

			// show bounding box
			//newSprite.debug = true;

			// add it to the obstacles group
			obstacles.add(newSprite);

			// reset timer
			lastSpawnTime = millis();
		}

		// if bernie overlaps with anything in obstacles group,
		// call hitObstacle function
		bernie.overlap(obstacles, hitObstacle);

		// if obstacles hit left side of screen...
		leftSideScreen.overlap(obstacles, deleteObstacle);

		// needed in p5 play, updates all your sprite objects
		drawSprites();
	}
}

// provide this with 2 arguments:
// 1: big fish
// 2: little fish
// in this case, collider1 is bernie, collider2 is obstacle
function hitObstacle(collider1, collider2) {
	// game over!
	gameOver = true;

	// set score in stone, you dead.
	endingScore = int(score);

	// remove thing bernie collided with
	//collider2.velocity.x = 0;
}

// delete obstacles that go off left side of screen
function deleteObstacle(col1, col2) {
	col2.remove();
}


