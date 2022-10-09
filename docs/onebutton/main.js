title = "Goalie";

description = ` 
Block Balls!

[Tap] Jump
[Hold] Jump Higher
`;

characters = [
// Frames for Player Idle Animation ("a-d")
`
 
 rrrr
rrlrlr
rrlrlr
 rrrr
 RR RR
`,`
 rrrr 
 rlrl
rrlrlr
rrrrrr
 rrrr
 RR RR
`,`
 rlrl 
rrlrlr
rrrrrr
 rrrr
 rrrr
 RR RR
`,`
 
 rlrl
rrlrlr
rrrrrr
 rrrr
 RR RR
`,
// Player Jump (e)
`
 rlrl
rrlrlr
rrrrrr
 rrrr
 R R
`,
// Ball (f)
`
  rl 
 lrlr
llrlrl
lrlllr
 llll
  ll
`,
// Arrows (g)
`
    
    L
   LL
  LLL
   LL
    L
`,
// Hearts (h)
`

  r r 
 rrrrr
 rrrrr
  rrr
   r
`,
// Cages (i)
`
l l l 
 l l l
l l l 
 l l l
l l l 
 l l l
`
];

const G = {
	WIDTH: 125,
	HEIGHT: 80
};

options = {
	viewSize: vec(G.WIDTH, G.HEIGHT),
	theme: "dark"
};

//======== GAME OBJECTS ========//
/** 
* @typedef {{ 
*	pos: Vector, 
*	isJump: boolean 
* }} Player 
*/
/**
* @type { Player }
*/ let player;

/** 
* @typedef {{ 
*	pos: Vector, 
*	speed: number
* }} Ball 
*/
/**
* @type { Ball }
*/ let ball;	

/** 
* @typedef {{ 
*	pos: Vector
* }} Heart 
*/
/**
* @type { Heart [] }
*/ let hearts;

/** 
* @typedef {{ 
*	pos: Vector,
* 	speed: number,
*	size: Vector
* }} Cloud 
*/
/**
* @type { Cloud [] }
*/ let clouds;
	

//======== GAME VARIABLES ========//
let row1 = G.HEIGHT - 40;
let row2 = G.HEIGHT - 28;
let row3 = G.HEIGHT - 15;
let y;
let vy;
let spawn;
let gameSpeed;
let saves;

//======== FUNCTIONS ========//
function newRow() {
	const x = rndi(1, 4);
	if (x == 1) return row1;
	if (x == 2) return row2;
	else 		return row3;
}
function update() {
	// Draw the sky
	color("cyan");
	rect(vec(0, 0), G.WIDTH, G.HEIGHT);

	// Draw the sun
	color("yellow");
	box(7,20,10,10);

	if (!ticks) {
		y = vy = 0;
		spawn = true;
		gameSpeed = 1.3;

		// Init the Heart and Life counter
		hearts = [];
		hearts.push({ pos: vec (G.WIDTH * 0.5 - 10, 4)});
		hearts.push({ pos: vec (G.WIDTH * 0.5, 4)});
		hearts.push({ pos: vec (G.WIDTH * 0.5 + 10, 4)});

		// Init the clouds array
		clouds = times(5, () => {
			return { pos: vec(rnd(0, G.WIDTH), rnd(15, 25)), speed: rnd(0.1, 1), size: vec(rnd(3, 20), rnd(2, 6)) };
		})
		
		// Init the player object
		player = {
			pos: vec(G.WIDTH * 0.2, G.HEIGHT - 10),
			isJump: false
		}
	}

	// Spawn the ball;
	if (spawn) {
		ball = ({ pos: vec(G.WIDTH + 3, newRow()), speed: gameSpeed});
		// Turn off spawn
		spawn = !spawn;
	}

	clouds.forEach((c) => {
		c.pos.x += c.speed;
		c.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		color("black");
		rect(c.pos, c.size.x, c.size.y);
	})

	// Draw the Arrows
	color("black");
	char("g", vec(G.WIDTH * 0.75, row1));
	char("g", vec(G.WIDTH * 0.75, row2));
	char("g", vec(G.WIDTH * 0.75, row3));

	// Draw the ball
	if (ball.pos.x > 6) {
		ball.pos.x -= ball.speed;
		color("black");
		char("f", ball.pos);
	} else {
		hearts.pop();
		if (hearts.length === 0) end();
		spawn = !spawn;
	}

	// Calculate the player's y position base on input
	if (!player.isJump && input.isPressed) {
		// play("powerUp");
		player.isJump = true;
		vy = 2.5;
	}
	if (player.isJump) {
		vy -= input.isPressed ? 0.1 : 0.3;
		y += vy;
		if (y < 0) {
			y = 0;
			player.isJump = false;
		}
	}

	// Draw Player and collision detection
	color("black");
	const c = player.isJump ? "e" : addWithCharCode("a", floor(ticks/10) % 4);
	if ( char(c, player.pos.x, player.pos.y - 3 - y).isColliding.char.f ) {
		ball = ({ pos: vec(G.WIDTH + 3, newRow()), speed: gameSpeed});
		addScore(1);
		gameSpeed = gameSpeed * 1.0105;
	}


	// Draw the cage
	color("black");
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 2; j++) {
			char("i", vec(6 + 6 * j, G.HEIGHT - 13 - 6 * i)); 
		}
	}
	rect (vec(3, G.HEIGHT - 13 - 33), 1, 36);
	rect (vec(3, G.HEIGHT - 13 - 33), 12, 1);

	// Draw the grass
	color("green");
	rect(0, G.HEIGHT - 10, G.WIDTH, 10);

	// Draw the Heart Counter
	hearts.forEach((h) => {
		color("black");
		char("h", h.pos);
	})
}
