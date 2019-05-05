/*               _       _     _
                (_)     | |   | |
__   ____ _ _ __ _  __ _| |__ | | ___  ___
\ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
 \ V / (_| | |  | | (_| | |_) | |  __/\__ \
  \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
*/
//animations like p5 images should be stored in variables
//in order to be displayed during the draw cycle
var rexy;
// singular sprite/collider to stand on
var ground;
// sprite/collider for left side of screen so objects that go off left side get deleted
var leftSideScreen;
// create variable to refer to obstacles group
var obstacles;
// how often do i want obstacles to spawn?
var spawnObstacleInterval = 300;	// half second
var lastSpawnTime;	// keep track of the last time spawn happened

var gameOver = false;
var gameOverButton;

// score counter
var score = 0;
var gameStartedTime = 0;


/*     _       _           _
      | |     | |         | |
  __ _| | ___ | |__   __ _| |
 / _` | |/ _ \| '_ \ / _` | |
| (_| | | (_) | |_) | (_| | |
 \__, |_|\___/|_.__/ \__,_|_|
  __/ |
 |___/
*/
	  // how fast he falls
var GRAVITY = 1;
		// how high he jumps
var JUMP = 15;



/*              _                 _
               | |               | |
 _ __  _ __ ___| | ___   __ _  __| |
| '_ \| '__/ _ \ |/ _ \ / _` |/ _` |
| |_) | | |  __/ | (_) | (_| | (_| |
| .__/|_|  \___|_|\___/ \__,_|\__,_|
| |
|_|
*/
function preload() {
	// create a rexy sprite
	rexy = createSprite();
	// call assets for rexy sprites
	rexy.addAnimation("running", "img/rexy-pixelated/rexy_00000.png", "img/rexy-pixelated/rexy_00008.png");
	rexy.addAnimation("jumping", "img/rexy-pixelated/rexyjump.png");
	rexy.scale = .4;
	rexy.animation.frameDelay = 4 ;
	// load fonts
	fontMed = loadFont('fonts/BarlowCondensed-Medium.ttf');
	fontBold = loadFont('fonts/BarlowCondensed-Black.ttf');
}


/*        _
         | |
 ___  ___| |_ _   _ _ __
/ __|/ _ \ __| | | | '_ \
\__ \  __/ |_| |_| | |_) |
|___/\___|\__|\__,_| .__/
                   | |
                   |_|
*/
function setup() {
	createCanvas(windowWidth, windowHeight);

  // button = createImg('https://res.cloudinary.com/dfiwfoxwx/image/upload/v1549657317/Life%20Coach/pause.png');
  // button.mousePressed(pauseGame);

	// adjust rexy position
	rexy.position.x = width/5;
	rexy.position.y = height/2;

	// sprites draw from their center, so start at width/2
	ground = createSprite(width/2, height - 10, width, height/2);
	ground.shapeColor = 224, 224, 224;

	// tell the sketch that obstacles will be a collection of things
	obstacles = new Group();

	// if hit left side screen, delete object
	leftSideScreen = createSprite(0, height/2, 0, height);
	leftSideScreen.shapeColor = 192, 192, 192;

	// start counting from this moment (for spawns)
	lastSpawnTime = millis();

	gameStartedTime = millis();

}


/*   _
    | |
  __| |_ __ __ ___      __
 / _` | '__/ _` \ \ /\ / /
| (_| | | | (_| |\ V  V /
 \__,_|_|  \__,_| \_/\_/
*/
function draw() {
	background(204,204,204);

	if(gameOver) {
		fill(0,0,0);
		textAlign(CENTER);
		textFont(fontBold);
		textSize(100);
		text("YOU FUCKING SUCK", windowWidth/2, windowHeight/2);
		textFont(fontMed);
		textSize(30);
		text("YOU LASTED " + score + " SECONDS", windowWidth/2, windowHeight/2 + 50);

		if(!gameOverButton){
		gameOverButton = createButton('TRY AGAIN');
		}
	  gameOverButton.style('display', 'block');
		gameOverButton.mousePressed(newGame);

		if(keyWentDown('space') || mouseWentDown(LEFT))
			newGame();
	}



	else {

		// gravity push down!
		rexy.velocity.y += GRAVITY;

		// did rexy collide with the singular ground object?
		if (rexy.collide(ground)) {
			rexy.changeAnimation("running");
			rexy.velocity.y = 0;
		}

		// if jump
		if (keyWentDown("space") || mouseWentDown(LEFT)) {
			rexy.changeAnimation("jumping");
			rexy.velocity.y = -JUMP;
		}

		// spawn obstacles logic
		if(millis() > lastSpawnTime + spawnObstacleInterval) {
			// spawn new obstacle
			var newSprite = createSprite(width, random(height/1.5), 40, 40);
			// add image to the variable newSprite called "obstacle"
			newSprite.addAnimation("obstacle", "img/coach.png");
			// scale "obstacle" image
			newSprite.scale = 1.5;
			// set the bounding box
			newSprite.setCollider("rectangle",0, 0, 30, 20);
			// give it a negative speed to go from right to left
			newSprite.velocity.x = -12;
			// add it to the obstacles group
			obstacles.add(newSprite);
			// reset timer
			lastSpawnTime = millis();
					// show bounding box for debugging
					newSprite.debug = false;
		}
		// if rexy overlaps with anything in obstacles group, call hitObstacle function
		rexy.overlap(obstacles, hitObstacle);

		// if obstacles hit left side of screen...
		leftSideScreen.overlap(obstacles, deleteObstacle);

		// score is how long youre alive
		score = int((millis() - gameStartedTime) / 1000)
		// styling for scoreboard text
		fill(0,0,0);
		textAlign(LEFT);
		textFont(fontBold);
		textSize(30);
		text("SCORE:", windowWidth/17, 50);
		textSize(50);
		text(score, windowWidth/17, 100);

		// needed in p5 play, updates all your sprite objects
		drawSprites();

	}
}



/*     _         _             _
      | |       | |           | |
  ___ | |__  ___| |_ __ _  ___| | ___  ___
 / _ \| '_ \/ __| __/ _` |/ __| |/ _ \/ __|
| (_) | |_) \__ \ || (_| | (__| |  __/\__ \
 \___/|_.__/|___/\__\__,_|\___|_|\___||___/
*/
// delete obstacles that go off left side of screen
function deleteObstacle(col1, col2) {
	col2.remove();
}

// provide this with 2 arguments:
		// 1: big fish
		// 2: little fish
		// in this case, collider1 is rexy, collider2 is obstacle
function hitObstacle(collider1, collider2) {
	// game over!
	gameOver = true;

	// remove thing rexy collided with
	collider2.velocity.x = 0;
}

/*
 _ __   _____      __   __ _  __ _ _ __ ___   ___
| '_ \ / _ \ \ /\ / /  / _` |/ _` | '_ ` _ \ / _ \
| | | |  __/\ V  V /  | (_| | (_| | | | | | |  __/
|_| |_|\___| \_/\_/    \__, |\__,_|_| |_| |_|\___|
                        __/ |
                       |___/  		*/
// reset sketch to start a new game
function newGame() {
	gameOver = false;
	obstacles.removeSprites();
	gameOverButton.hide();
	setup();
	// updateSprites(true); rexy.position.x = width / 5; rexy.position.y = height-100;
}

function pauseGame() {

}



// gameOverButton.style('position', 'absolute');
// 	 gameOverButton.style('font-size', '30px');
// 	 gameOverButton.style('background-color', '#ccc');
// 	 gameOverButton.style('border', '3px solid #000');
// 	 gameOverButton.style('box-shadow', '0 0 0 0 rgba(0,0,0,0)');
// 	 gameOverButton.style('left', '50%');
// 	 gameOverButton.style('top', '65%');
// 	 gameOverButton.style('transform', 'translate(-50%, -50%)');
// 	 gameOverButton.style('font-family', '"BarlowCondensed-Medium"')
// 	 gameOverButton.style('padding', '1% 4%')
