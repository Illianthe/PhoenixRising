/**
 * This is the file that contains all of the JS that runs the game.
 * Warning: Here be dragons! Proceed at your own peril, lest your eyes
 * be scarred for life. ;)
 **/

$(document).ready(function() {
	// Enable restart button
	$("#restart").click(function(e) {
		location.reload();
	});
	
	// Preload
	var img = [];
	for (var i = 0; i < Constant.images.length; i++) {
		img[i] = new Image();
		img[i].src = Constant.images[i];
	}
	
	Engine.init();
});

// Keyup is less sensitive to timing than keydown
$(document).keyup(function(e) {
	State.processKeypress(e.keyCode);
});

var Constant = {
	interval : 50,    // Time (ms) before next update
	canvasId : "canvas",    // Name of the canvas to draw on
	canvasWidth : 1000,
	canvasHeight : 500,
	tileSize : 40,    // Each tile in the game world will be 40x40 pixels
	numLevels : 3,    // Number of levels
	movement : {
		up : 0,
		down : 1,
		left : 2,
		right : 3,
	},
	state : {
		main : 0,
		start : 1,
		run : 2,
		levelPass : 3,
		levelFail : 4,
		end : 5,
	},
	screen : {
		main : 0,
		game : 1,
		levelPass : 2,
		levelFail : 3,
		end : 4,
	},
	images : [
		"assets/images/botleftcornerwall.png",
		"assets/images/botrightcornerwall.png",
		"assets/images/botwall.png",
		"assets/images/end.png",
		"assets/images/glacier.png",
		"assets/images/ice.png",
		"assets/images/leftwall.png",
		"assets/images/levelcomplete.png",
		"assets/images/levelfail.png",
		"assets/images/phoenixdown.png",
		"assets/images/phoenixleft.png",
		"assets/images/phoenixright.png",
		"assets/images/phoenixup.png",
		"assets/images/rightwall.png",
		"assets/images/start.png",
		"assets/images/topleftcornerwall.png",
		"assets/images/toprightcornerwall.png",
		"assets/images/topwall.png",
		"assets/images/twig.png",
		"assets/images/water.png",
	],
	ability : {
		fireball : 0,
		freeze : 1,
	}
}

var Engine = {
	canvas : null,    // ID of the canvas to draw on
	context : null,    // Canvas context
	gameLoop : null,    // ID used by setInterval/clearInterval

	// Initialize variables and all that jazz
	init : function() {
		// Setting up hooks to the canvas element (note the selector
		// returns a jQuery object - need to select the first result)
		this.canvas = $("#" + Constant.canvasId)[0];
		this.context = this.canvas.getContext("2d");
		
		State.init();
		this.gameLoop = setInterval(this.update, Constant.interval);
	},
	
	// Updates game information for a specific frame
	update : function() {
		State.update();
	},
	
	// Clear canvas
	clearCanvas : function() {
		this.context.clearRect(0, 0, Constant.canvasWidth, Constant.canvasHeight);
	},
	
	// Render map to canvas
	renderGame : function() {
		// Starting coordinates - centered
		var startx = (Constant.canvasWidth / 2) - (Game.level.width * Constant.tileSize / 2);
		var starty = (Constant.canvasHeight / 2) - (Game.level.height * Constant.tileSize / 2);
	
		Engine.clearCanvas();
		for (var x = 0; x < Game.level.width; x++) {
			for (var y = 0; y < Game.level.height; y++) {
				Game.level.map[x][y].render(x * Constant.tileSize + startx, y * Constant.tileSize + starty, x, y);
			}
		}
	},
}

var State = {
	curState : null,
	
	init : function() {
		this.curState = Constant.state.main;
	},
	
	update : function() {
		switch (this.curState) {
			case Constant.state.main: {
				Screen.main.update();
				break;
			}
			case Constant.state.run: {
				Screen.game.update();
				break;
			}
			case Constant.state.levelPass: {
				Screen.levelPass.update();
				break;
			}
			case Constant.state.levelFail: {
				Screen.levelFail.update();
				break;
			}
			case Constant.state.end: {
				Screen.end.update();
				break;
			}
		}
	},
	
	// Depending on the state of the game, keypresses
	// can have different effects
	processKeypress : function(keyCode) {
		switch (this.curState) {
			case Constant.state.main: {
				Screen.main.processKeypress(keyCode);
				break;
			}
			case Constant.state.run: {
				Screen.game.processKeypress(keyCode);
				break;
			}
			case Constant.state.levelPass: {
				Screen.levelPass.processKeypress(keyCode);
				break;
			}
			case Constant.state.levelFail: {
				Screen.levelFail.processKeypress(keyCode);
				break;
			}
			case Constant.state.end: {
				Screen.end.processKeypress(keyCode);
				break;
			}
		}
	},
}

var Screen = {
	curScreen : null,
	
	main : {
		update : function() {
			if (Screen.curScreen !== Constant.screen.main) {
				var img = new Image(1000, 500);
				img.src = "assets/images/start.png";
				img.onload = function() {
					Engine.context.drawImage(img, 0, 0);
				}
				Screen.curScreen = Constant.screen.main;
			}
		},
		
		processKeypress : function(keyCode) {
			switch (keyCode) {
				// Space or enter
				case 32:
				case 13: {
					State.curState = Constant.state.run;
					Screen.game.init();
					break;
				}
			}
		},
	},
	
	game : {
		init : function() {
			Screen.curScreen = Constant.screen.game;
			Game.init();
		},
		
		update : function() {
			Screen.curScreen = Constant.screen.game;
			Game.update();
		},
		
		processKeypress : function(keyCode) {
			switch (keyCode) {
				// Up arrow or 'w'
				case 38:
				case 87: {
					Game.processKeypress(Constant.movement.up);
					break;
				}
				// Left arrow or 'a'
				case 37:
				case 65: {
					Game.processKeypress(Constant.movement.left);
					break;
				}
				// Down arrow or 's'
				case 40:
				case 83: {
					Game.processKeypress(Constant.movement.down);
					break;
				}
				// Right arrow or 'd'
				case 39:
				case 68: {
					Game.processKeypress(Constant.movement.right);
					break;
				}
				// 1 - trigger fireball
				case 49: {
					Game.triggerAbility(Constant.ability.fireball);
					break;
				}
				// 2 - trigger freeze
				case 50: {
					Game.triggerAbility(Constant.ability.freeze);
					break;
				}
			}
		},
	},
	
	levelPass : {
		update : function() {
			if (Screen.curScreen !== Constant.screen.levelPass) {		
				// Draw overlay
				Engine.context.fillStyle = "rgba(255, 255, 255, .3)";
				Engine.context.fillRect(0, 0, Constant.canvasWidth, Constant.canvasHeight);
			
				var img = new Image(500, 250);
				img.src = "assets/images/levelcomplete.png";
				
				// Calculate starting pos to draw on center of canvas
				var x = (Constant.canvasWidth / 2) - (img.width / 2);
				var y = (Constant.canvasHeight / 2) - (img.height / 2);
				// Draw border
				Engine.context.fillStyle = "#333333";
				Engine.context.fillRect(x - 3, y - 3, img.width + 6, img.height + 6);
				// Render the image
				Engine.context.drawImage(img, x, y);
				
				Screen.curScreen = Constant.screen.levelPass;
			}
		},
		
		processKeypress : function(keyCode) {
			switch (keyCode) {
				// Space or enter
				case 32:
				case 13: {
					State.curState = Constant.state.run;
					Game.nextLevel();
					break;
				}
			}
		},
	},
	
	levelFail : {
		update : function() {
			if (Screen.curScreen !== Constant.screen.levelFail) {
				// Draw overlay
				Engine.context.fillStyle = "rgba(255, 255, 255, .3)";
				Engine.context.fillRect(0, 0, Constant.canvasWidth, Constant.canvasHeight);
			
				var img = new Image(500, 250);
				img.src = "assets/images/levelfail.png";
				
				// Calculate starting pos to draw on center of canvas
				var x = (Constant.canvasWidth / 2) - (img.width / 2);
				var y = (Constant.canvasHeight / 2) - (img.height / 2);
				// Draw border
				Engine.context.fillStyle = "#333333";
				Engine.context.fillRect(x - 3, y - 3, img.width + 6, img.height + 6);
				// Render the image
				Engine.context.drawImage(img, x, y);
				
				Screen.curScreen = Constant.screen.levelFail;
			}
		},
		
		processKeypress : function(keyCode) {
			switch (keyCode) {
				// Space or enter
				case 32:
				case 13: {
					State.curState = Constant.state.run;
					Game.restartLevel();
					break;
				}
			}
		},
	},
	
	end : {
		update : function() {
			if (Screen.curScreen != Constant.screen.end) {
				var img = new Image(500, 250);
				img.src = "assets/images/end.png";
				
				// Calculate starting pos to draw on center of canvas
				var x = (Constant.canvasWidth / 2) - (img.width / 2);
				var y = (Constant.canvasHeight / 2) - (img.height / 2);
				// Draw border
				Engine.context.fillStyle = "#333333";
				Engine.context.fillRect(x - 3, y - 3, img.width + 6, img.height + 6);
				// Render the image
				Engine.context.drawImage(img, x, y);
				
				Screen.curScreen = Constant.screen.end;
			}
		},
		
		processKeypress : function(keyCode) {
			switch (keyCode) {
				// Space or enter
				case 32:
				case 13: {
					State.curState = Constant.state.main;
					break;
				}
			}
		},
	},		
}

var Entity = {
	phoenix : (function() {
		var collidable = false;
		var passThrough = false;
		
		var phoenix = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.position = Constant.movement.right;
			
			this.render = function(x, y) {
				var img = new Image(Constant.tileSize, Constant.tileSize);
				switch (this.position) {
					case Constant.movement.up: {
						img.src = "assets/images/phoenixup.png";
						break;
					}
					case Constant.movement.right: {
						img.src = "assets/images/phoenixright.png";
						break;
					}
					case Constant.movement.down: {
						img.src = "assets/images/phoenixdown.png";
						break;
					}
					case Constant.movement.left: {
						img.src = "assets/images/phoenixleft.png";
						break;
					}
				}
				Engine.context.drawImage(img, x, y);
			}
		}
		return phoenix;
	})(),
	
	ice : (function() {
		var collidable = true;
		var passThrough = true;

		var ice = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(x, y) {
				var img = new Image(Constant.tileSize, Constant.tileSize);
				img.src = "assets/images/ice.png";
				Engine.context.drawImage(img, x, y);
			}
		}
		return ice;
	})(),
	
	glacier : (function() {
		var collidable = false;
		var passThrough = false;

		var glacier = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(x, y) {
				var img = new Image(Constant.tileSize, Constant.tileSize);
				img.src = "assets/images/glacier.png";
				Engine.context.drawImage(img, x, y);
			}
		}
		return glacier;
	})(),
	
	twig : (function() {
		var collidable = true;
		var passThrough = false;

		var twig = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(x, y) {
				var img = new Image(Constant.tileSize, Constant.tileSize);
				img.src = "assets/images/twig.png";
				Engine.context.drawImage(img, x, y);
			}
		}
		return twig;
	})(),
	
	wall : (function() {
		var collidable = false;
		var passThrough = false;
		
		var wall = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(drawx, drawy, x, y) {
				var img = new Image(Constant.tileSize, Constant.tileSize);
				
				// Surrounding tiles
				var top = (y > 0) ? Game.level.map[x][y - 1].constructor : Entity.theVoid;
				var bot = (y < Game.level.height - 1) ? Game.level.map[x][y + 1].constructor : Entity.theVoid;
				var left = (x > 0) ? Game.level.map[x - 1][y].constructor : Entity.theVoid;
				var right = (x < Game.level.width - 1) ? Game.level.map[x + 1][y].constructor : Entity.theVoid;
				
				// Top left corner
				if ((top === Entity.theVoid || top === null) &&
				    (left === Entity.theVoid || left === null)) {
					img.src = "assets/images/topleftcornerwall.png";
				}
				// Top right corner
				else if ((top === Entity.theVoid || top === null) &&
				         (right === Entity.theVoid || right === null)) {
					img.src = "assets/images/toprightcornerwall.png";
				}
				// Bottom left corner
				else if ((bot === Entity.theVoid || bot === null) &&
				    (left === Entity.theVoid || left === null)) {
					img.src = "assets/images/botleftcornerwall.png";
				}
				// Bottom right corner
				else if ((bot === Entity.theVoid || bot === null) &&
				         (right === Entity.theVoid || right === null)) {
					img.src = "assets/images/botrightcornerwall.png";
				}
				// Top
				else if (top === Entity.theVoid || top === null) {
					img.src = "assets/images/topwall.png";
				}
				// Bottom
				else if (bot === Entity.theVoid || bot === null) {
					img.src = "assets/images/botwall.png";
				}
				// Left
				else if (left === Entity.theVoid || left === null) {
					img.src = "assets/images/leftwall.png";
				}
				// Right
				else if (right === Entity.theVoid || right === null) {
					img.src = "assets/images/rightwall.png";
				}
				
				Engine.context.drawImage(img, drawx, drawy);
			}
		}
		return wall;
	})(),
	
	water : (function() {
		var collidable = true;
		var passThrough = false;
		
		var water = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(x, y) {
				var img = new Image(Constant.tileSize, Constant.tileSize);
				img.src = "assets/images/water.png";
				Engine.context.drawImage(img, x, y);
			}
		}
		return water;
	})(),
	
	snow : (function() {
		var collidable = true;
		var passThrough = false;
		
		var snow = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(x, y) {
				Engine.context.fillStyle = "#FFFFFF";
				Engine.context.fillRect(x, y, Constant.tileSize, Constant.tileSize);
			}
		}
		return snow;
	})(),
	
	theVoid : (function() {
		var collidable = true;
		var passThrough = false;
		
		var theVoid = function() {
			this.isCollidable = function() {
				return collidable;
			}
			
			this.isPassThrough = function() {
				return passThrough;
			}
			
			this.render = function(x, y) {
				Engine.context.fillStyle = "#000000";
				Engine.context.fillRect(x, y, Constant.tileSize, Constant.tileSize);
			}
		}
		return theVoid;
	})(),
}

var Game = {
	// Describes current level in the game
	level : {
		levelId : 0,    // Current level number
		width : 0,    // Width of the level in tiles
		height : 0,    // Height of the level in tiles
		map : null,    // Multidimensional array holding the level's tiles
		twigsLeft : 0,    // Twigs left to collect
	},
	
	// Describes player
	player : {
		position : {    // Current position of the player on the map
			x : 0,
			y : 0,
		},
		movement : null,    // Next move
		moveNext : false,
		alive : false,    // Dead or alive?!
		curAbility : null,    // Current abilitiy triggered
		ability : {    // Count remaining
			fireball : 0,
			freeze : 0,
		},
	},

	init : function() {
		Game.nextLevel();
	},
	
	nextLevel : function() {
		// Continue to next level
		if (this.level.levelId < Constant.numLevels) {
			this.resetDefault(this.level.levelId);
			this.level.levelId++;
			
			// Output info
			$("#info").show();
			$("#level").text(this.level.levelId + "/" + Constant.numLevels);
			
			Game.load(this.level.levelId);
			Engine.renderGame();
		}
		// Finished game
		else {
			this.resetDefault();
			State.curState = Constant.state.end;
			$("#info").hide();
		}
	},
	
	restartLevel : function() {
		this.resetDefault(this.level.levelId);
		Game.load(this.level.levelId);
		Engine.renderGame();
	},
	
	// Set objects to default values when loading next level,
	// restarting current level, or ending game. Passed an optional
	// argument to preserve current level.
	resetDefault : function(level) {
		this.level = {
			levelId : ((typeof level === "undefined") ? 0 : level),
			width : 0,
			height : 0,
			map : null,
			twigsLeft : 0,
		}
		this.player = {
			position : {
				x : 0,
				y : 0,
			},
			movement : null,
			moveNext : false,
			alive : false,
			curAbility : null,
			ability : {
				fireball : 0,
				freeze : 0,
			},
		}
	},
	
	// Load level from file
	load : function(level) {
		var that = this;
	
		// Parse XML to generate game objects
		var parse = function(data) {
			$(data).find("level").each(function() {
				that.level.width = parseInt($(this).attr("width"));
				that.level.height = parseInt($(this).attr("height"));

				that.player.ability.fireball = ($(this).attr("fireball") !== undefined) ? parseInt($(this).attr("fireball")) : 0;
				that.player.ability.freeze = ($(this).attr("freeze") != undefined) ? parseInt($(this).attr("freeze")) : 0;
				$("#fireball").text(that.player.ability.fireball);
				$("#freeze").text(that.player.ability.freeze);
				
				// Construct multidimensional array
				that.level.map = new Array(that.level.width);
				for (var i = 0; i < that.level.map.length; i++) {
					that.level.map[i] = new Array(that.level.height)
				}
				
				// Generate objects for each representation in the XML document
				$(this).find("row").each(function(index) {
					var row = $(this).text();
					for (var i = 0; i < that.level.width; i++) {
						switch (row[i]) {
							// Wall
							case "W": {
								that.level.map[i][index] = new Entity.wall;
								break;
							}
							// Phoenix
							case "P": {
								that.level.map[i][index] = new Entity.phoenix;
								that.player.position.x = i;
								that.player.position.y = index;
								that.player.alive = true;
								break;
							}
							// Ice
							case "I": {
								that.level.map[i][index] = new Entity.ice;
								break;
							}
							// Glacier
							case "G": {
								that.level.map[i][index] = new Entity.glacier;
								break;
							}
							// Twig
							case "T": {
								that.level.twigsLeft++
								that.level.map[i][index] = new Entity.twig;
								break;
							}
						}
					}
				});
			});
		};
		
		$.ajax({
			async : false,
			type : "GET",
			url : "data/levels/level" + level + ".xml",
			dataType : "xml",
			success : parse,
		});
	},
	
	// Determine how to move character next update
	processKeypress : function(direction) {
		this.player.movement = direction;
	},

	// Use ability on next move
	triggerAbility : function(ability) {
		// We want to be able to toggle by pressing the same button
		this.player.curAbility = (this.player.curAbility != ability) ? ability : null;
		
		// Can't use ability if none left
		switch (ability) {
			case Constant.ability.fireball: {
				if (this.player.ability.fireball == 0) {
					this.player.curAbility = null;
				}
				break;
			}
			case Constant.ability.freeze : {
				if (this.player.ability.freeze == 0) {
					this.player.curAbility = null;
				}
				break;
			}
		}
	},
	
	// Process ability use
	useAbility : function(ability) {
		switch (ability) {
			case Constant.ability.fireball: {
				this.player.curAbility = null;
				this.player.ability.fireball--;
				$("#fireball").text($("#fireball").text() - 1);
				break;
			}
			case Constant.ability.freeze: {
				this.player.curAbility = null;
				this.player.ability.freeze--;
				$("#freeze").text($("#freeze").text() - 1);
				break;
			}
		}
	},
	
	// Update game based on next action
	update : function() {
		var position = this.player.position;
		var movement = this.player.movement;
		var map = this.level.map;
	
		// Don't really care if there isn't a movement action queued...
		if (movement !== null) {
			switch (movement) {
				case Constant.movement.up : {
					var next = position.y - 1;
					while (map[position.x][next].isCollidable() ||
					       (map[position.x][next].constructor == Entity.glacier &&
						   this.player.curAbility == Constant.ability.fireball)) {
						this.checkTile(map[position.x][position.y], map[position.x][next]);
						
						map[position.x][next] = map[position.x][position.y];
						map[position.x][next].position = Constant.movement.up;
						map[position.x][position.y] = new Entity.water;
						position.y--;
						next--;
						
						if (!this.player.moveNext) {
							break;
						}
					}
					break;
				}
				case Constant.movement.down : {
					var next = position.y + 1;
					while (map[position.x][next].isCollidable() ||
					       (map[position.x][next].constructor == Entity.glacier &&
						   this.player.curAbility == Constant.ability.fireball)) {
						this.checkTile(map[position.x][position.y], map[position.x][next]);
						
						map[position.x][next] = map[position.x][position.y];
						map[position.x][next].position = Constant.movement.down;
						map[position.x][position.y] = new Entity.water;
						position.y++;
						next++;
						
						if (!this.player.moveNext) {
							break;
						}
					}
					break;
				}
				case Constant.movement.left : {
					var next = position.x - 1;
					while (map[next][position.y].isCollidable() ||
					       (map[next][position.y].constructor == Entity.glacier &&
						   this.player.curAbility == Constant.ability.fireball)) {
						this.checkTile(map[position.x][position.y], map[next][position.y]);
						
						map[next][position.y] = map[position.x][position.y];
						map[next][position.y].position = Constant.movement.left;
						map[position.x][position.y] = new Entity.water;
						position.x--;
						next--;
						
						if (!this.player.moveNext) {
							break;
						}
					}
					break;
				}
				case Constant.movement.right : {
					var next = position.x + 1;
					while (map[next][position.y].isCollidable() ||
					       (map[next][position.y].constructor == Entity.glacier &&
						   this.player.curAbility == Constant.ability.fireball)) {
						this.checkTile(map[position.x][position.y], map[next][position.y]);
						
						map[next][position.y] = map[position.x][position.y];
						map[next][position.y].position = Constant.movement.right;
						map[position.x][position.y] = new Entity.water;
						position.x++;
						next++;
						
						if (!this.player.moveNext) {
							break;
						}
					}
					break;
				}
			}
		}
		Engine.renderGame();
		this.checkCondition();
		this.player.movement = null;
	},
	
	// Check object at certain tile and perform actions on it
	// Mutates and returns processNext to calling funtion.
	checkTile : function(curTile, nextTile) {
		// If tile lets you pass through, continue execution
		this.player.moveNext = nextTile.isPassThrough();
	
		// Aww, bird fell into the water. :( ...or did she?
		if (curTile.constructor == Entity.phoenix && nextTile.constructor == Entity.water) {
			// Freeze tile of water and continue execution
			if (this.player.curAbility == Constant.ability.freeze) {
				this.useAbility(Constant.ability.freeze);
				this.player.moveNext = true;
			}
			else {
				this.player.alive = false;
			}
		}
		// Glacier! Breathe fire to melt it...
		else if (nextTile.constructor == Entity.glacier) {
			this.useAbility(Constant.ability.fireball);
			this.player.moveNext = true;
		}
		// Yay, found twig
		else if (nextTile.constructor == Entity.twig) {
			this.level.twigsLeft--;
		}
	},
	
	// Check end-game conditions
	checkCondition : function() {
		if (this.level.twigsLeft == 0) {
			State.curState = Constant.state.levelPass;
		}
		else if (this.player.alive == false) {
			State.curState = Constant.state.levelFail;
		}
	},
}
