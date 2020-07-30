class BodyPart {
	constructor(x, y, dir) {
		this.x = x;
		this.y = y;
		this.dir = dir;
	}

	collides(it) {
		// Checks if both objects are on the same tile
		return this.xx == it.xx && this.yy == it.yy;
	}

	// Getters for tile x and y

	get xx() {
		return Math.round(this.x / scl);
	}
	get yy() {
		return Math.round(this.y / scl);
	}

	//
}

export class Snake {
	constructor(x, y, length, color) {
		this.x = x;
		this.y = y;
		this.color = color;

		this.body = [];

		this.dir = { x: 0, y: 0 };
		this.newDir = { x: 0, y: 0 };

		// Loading images
		this.greenFace = new Image();
		this.greenFace.src = "images/head.png";

		this.redFace = new Image();
		this.redFace.src = "images/redHead.png";
		//

		this.face = this.greenFace;

		for (var i = 0; i < length; i++) {
			this.body.push(
				new BodyPart((this.x - i) * scl, this.y * scl, { x: 1, y: 0 })
			);
		}
	}

	update() {
		if (this.isDead) return;

		// Stores new direction to a variable, so that when the snake has passed a full tile
		// it can change direction. If it would've directly set the direction the snake
		// could've turned mid-tile (not good)
		if ((keys["a"] || keys["arrowleft"]) && this.dir.x == 0) {
			this.newDir.x = -1;
			this.newDir.y = 0;
		}
		if ((keys["d"] || keys["arrowright"]) && this.dir.x == 0) {
			this.newDir.x = 1;
			this.newDir.y = 0;
		}
		if ((keys["s"] || keys["arrowdown"]) && this.dir.y == 0) {
			this.newDir.y = 1;
			this.newDir.x = 0;
		}
		if ((keys["w"] || keys["arrowup"]) && this.dir.y == 0) {
			this.newDir.y = -1;
			this.newDir.x = 0;
		}
		// ...
		// ..
		// .

		// If all directions are zero, the game hasn't started yet (unless some stupid bug i
		// havent discovered yet happens). Therefore the snake shouldnt start moving, and
		// it returns out of the function
		if (
			this.dir.x == 0 &&
			this.dir.y == 0 &&
			this.newDir.x == 0 &&
			this.newDir.y == 0
		)
			return;

		if (
			(this.head.x / scl).toFixed(1).substr(-1) == 0 &&
			(this.head.y / scl).toFixed(1).substr(-1) == 0
		) {
			// Stuff that should only happen when the snake has come to an around tile number
			if (this.checkDeath() && !this.isDead)
				// Returns the return val of die (undefined).
				// Shortcut so i dont have to write mutliple lines (this comment kind of defeats the purpose)
				return this.die();

			// Checks if a move in the new direction will result in the head hitting its own neck
			// Sets heads and snakes direction to it if it doesn't
			if (
				!(
					this.body[1].xx == this.head.xx + this.newDir.x &&
					this.body[1].yy == this.head.yy + this.newDir.y
				)
			) {
				this.dir.x = this.newDir.x;
				this.dir.y = this.newDir.y;

				this.head.dir.x = this.dir.x;
				this.head.dir.y = this.dir.y;
			}

			// Sets direction of each bodypart (except for the head) to point to the next bodypart
			for (let i = this.length - 1; i > 0; i--) {
				this.body[i].dir.x =
					(this.body[i - 1].x - this.body[i].x) / scl;
				this.body[i].dir.y =
					(this.body[i - 1].y - this.body[i].y) / scl;
			}
		}

		// Moves each bodyparts according to its direction object and the speed variable
		this.body.forEach(it => {
			it.x += it.dir.x * speed;
			it.y += it.dir.y * speed;
		});
	}

	/** @param {CanvasRenderingContext2D} ctx */
	draw(ctx) {
		this.body.forEach(it => {
			// Fills rect on each bodypart's position
			ctx.fillStyle = this.color;
			ctx.fillRect(it.x, it.y, scl, scl);

			// Draws hitbox if shift key is pressed (for debugging)
			if (keys["shift"]) {
				ctx.strokeStyle = "red";
				ctx.strokeRect(it.xx * scl, it.yy * scl, scl, scl);
			}
		});

		// Draws face at the head's position (logical unless you're some kind of alien)
		ctx.drawImage(this.face, this.head.x, this.head.y, scl, scl);
	}

	// Function to append new bodypart to end of tail
	appendNew() {
		let last = this.tail;
		this.body.push(
			// Adds new bodypart at the last bodyparts position
			// (it will eventually "pop" out)
			// The direction values are 0 since they're irrelevant. The part will pop out anyway
			new BodyPart(last.x, last.y, { x: 0, y: 0 })
		);
	}

	checkDeath() {
		// Checks if head is out of bounds. (I think this is readable)
		if (
			this.head.xx >= tileCount ||
			this.head.yy >= tileCount ||
			this.head.xx < 0 ||
			this.head.yy < 0
		)
			return true;

		// Checks if the head collides with any other body part
		for (let i = 1; i < this.length; i++) {
			if (this.head.collides(this.body[i])) return true;
		}

		return false;
	}

	die() {
		this.isDead = true;

		let previousColor = this.color;

		this.color = "red";
		this.face = this.redFace;

		setTimeout(() => {
			this.color = previousColor;
			this.face = this.greenFace;
			setTimeout(() => {
				this.color = "red";
				this.face = this.redFace;
			}, 200);
		}, 200);
	}

	// Useful getters. The names talk for themselves

	get length() {
		return this.body.length;
	}
	get head() {
		return this.body[0];
	}
	get tail() {
		return this.body[this.body.length - 1];
	}
	get xx() {
		return this.head.xx;
	}
	get yy() {
		return this.head.yy;
	}

	//
}
