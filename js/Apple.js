export class Apple {
	constructor(xx, yy, padding) {
		this.xx = xx;
		this.yy = yy;
		this.padding = padding;
		this.p = padding;
		this.color = "red";
	}

	generateNew() {
		this.xx = Math.round(Math.random() * (tileCount - 1));
		this.yy = Math.round(Math.random() * (tileCount - 1));

		let inSnake = false;
		snake.body.forEach(it => {
			if (it.xx == this.xx && this.yy == it.yy) inSnake = true;
		});

		if (inSnake) this.generateNew();
		else this.p = scl / 2;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(
			this.x + this.p,
			this.y + this.p,
			scl - this.p * 2,
			scl - this.p * 2
		);

		if (this.p > this.padding) this.p--;
	}

	get x() {
		return this.xx * scl;
	}
	get y() {
		return this.yy * scl;
	}
}
