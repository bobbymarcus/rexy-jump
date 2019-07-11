// player sprite
var jumper;
var canJump = false;	// keep player from double jumping

// singular collider to stand on
var platforms;
// how often should platforms spawn?
var platformSpawnInterval = 1400;
var lastPlatformSpawned = 0;

var offscreenLeft;	// destroy objects that go off left side
var offscreenBottom;	// destroy objects that go off bottom

// a few global parameters we can freely adjust
var GRAVITY = 1;
var JUMP = 25;	// how powerful is jump?
var MIN_WORLD_SPEED = -7.0;	// how fast to buildings move? min
var MAX_WORLD_SPEED = -25.0;// max
var worldSpeed = MIN_WORLD_SPEED;	// current
var PLATFORM_HEIGHT = 40;

// keep track of score, loss, etc.
var score = 0;
var gameStartedTime = 0;
var gameOver = false;
var gameFont;

// sounds
var sound_jump;
var sound_lose;
var sound_music;

// it's advisable (but not necessary) to load the images in the preload function
// of your sketch otherwise they may appear with a little delay
function preload() {

	// create a player sprite
	jumper = createSprite();
	// optional: offset collision a bit
	jumper.setCollider("rectangle", -4, 0, 150, 410);
	//jumper.debug = true;
	// give him a couple animation types and specify where the files exist
	jumper.addAnimation("running", "assets/bernie-walk-0.png", "assets/bernie-walk-3.png");
	jumper.addAnimation("jumping", "assets/bernie-jump.png");
	// he's too big so scale him down to 30%
	jumper.scale = .3;
	// he runs too fast so put 6 frames between each image in sprite animation
	jumper.animation.frameDelay = 6;

	// load sounds
	sound_jump = loadSound("assets/jump.wav");
	sound_lose = loadSound("assets/lose.wav");
	sound_music = loadSound("assets/music.wav");
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// load font and such
	textSize(50);
	gameFont = loadFont("assets/TinyPixy.ttf");
	textFont(gameFont);

	// starting bernie position
	jumper.position.x = width / 4;
	jumper.position.y = height / 2;

	// in p5.play, this is how you create a group of things
	// note: different than an array like we've been doing!
	platforms = new Group();

	// starting platform
	var platform = createSprite(width / 2, height * .8, width, PLATFORM_HEIGHT);
	platform.velocity.x = worldSpeed;
	// im not sure why but we have to manually set collider
	// properties, probably a bug
	platform.setCollider("rectangle", 0, 0, width, PLATFORM_HEIGHT);
	platform.shapeColor = color(random(100, 190));
	// add to platforms group
	platforms.add(platform);

	// spawn one immediately, trick program into thinking it spawned one
	// a long time ago
	lastPlatformSpawned = -10000;

	// set up left side collider
	offscreenLeft = createSprite(-1500, height/2, 10, height);
	offscreenBottom = createSprite(width/2, height + 20, width, 10);

	// keep track of time...
	gameStartedTime = millis();

	// play that track!
	sound_music.loop();
}

function draw() {
	if(!gameOver) {

		// game is playing

		background(80, 200, 250);

		// draw score to screen
		score = int((millis() - gameStartedTime) / 10);

		textAlign(LEFT, CENTER);

		// drop shadow text... draw black first
		fill(0);
		text("SCORE: " + score, 16 + 3, 20 + 3);
		// white text next
		fill(255);
		text("SCORE: " + score, 16, 20);

		// make new platform if it's time
		if (millis() > lastPlatformSpawned + platformSpawnInterval) {
			// set up platform properties
			var platformWidth = width/4;
			var platformY = random(height*.5, height*.8);

			var platform = createSprite(width + platformWidth / 2, platformY, platformWidth, PLATFORM_HEIGHT);

			platform.velocity.x = worldSpeed;
			//platform.debug = true;
			// im not sure why but we have to manually set collider
			// properties, probably a bug
			platform.setCollider("rectangle", 0, 0, platformWidth, PLATFORM_HEIGHT);
			platform.shapeColor = color(random(100, 190));
			platforms.add(platform);

			lastPlatformSpawned = millis();

			// increase speed of platforms going by
			worldSpeed = constrain(worldSpeed - .2, MAX_WORLD_SPEED, MIN_WORLD_SPEED);

			// increase frequency of platforms spawns to match using... map!
			platformSpawnInterval = map(worldSpeed, MIN_WORLD_SPEED, MAX_WORLD_SPEED, 1400, 1400/3.6);
		}

		// gravity push down on jumper, constantly
		jumper.velocity.y += GRAVITY;

		// if we land on top of a platform
		if (jumper.collide(platforms)) {
			// he touched a platform, make it so he can jump again
			canJump = true;
			// and back to running animation
			jumper.changeAnimation("running");
			// if hes on building, dont let gravity push him down
			jumper.velocity.y = 0;
		}

		// if we fall off bottom or left side
		if(jumper.collide(offscreenBottom) || jumper.position.x < 0) {
			gameOver = true;
			sound_lose.play();
		}

		// if player clicks, presses x, jump!
		if (keyWentDown("x") || mouseWentDown(LEFT)) {
			// and they are currently grounded
			if(canJump) {
				jumper.changeAnimation("jumping");
				jumper.velocity.y = -JUMP;
				canJump = false;

				// play sound
				sound_jump.play();
			}
		}

		// delete any offscreen platforms
		offscreenLeft.collide(platforms, deleteBuilding);

		// p5 play requires you to do this, it's what does all the
		// sprite magic!
		drawSprites();

	} else {
		// game over...
		background(50);

		// draw end game text
		textAlign(CENTER, CENTER);

		// drop shadow text...
		fill(0);
		text("YOU ARE DEAD BUT AT LEAST YOU \n SCORED " + score + " POINTS", width/2 + 3, height/2 + 3);
		// white text
		fill(255);
		text("YOU ARE DEAD BUT AT LEAST YOU \n SCORED " + score + " POINTS", width/2, height/2);

	}
}

// if building goes off left side, delete it
function deleteBuilding(offscreenLeftCollider, buildingCollider) {
	buildingCollider.remove();
}
