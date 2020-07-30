import { Snake } from "./Snake.js";
import { StorageHandler } from "./StorageHandler.js";
import { Apple } from "./Apple.js";

// Types are for vscode to understand

/** @type {Apple} */
let apple;

/** @type {StorageHandler} */
let storage;

let highscore;
let score = 0;

/** @type {CanvasRenderingContext2D} ctx */
let ctx;

window.tileCount = 11;

window.speed = 7;
let pause = false;

function init() {
	let canvas = document.querySelector("#canvas");
	ctx = canvas.getContext("2d");

	storage = new StorageHandler();

	window.scl = canvas.width / tileCount;

	apple = new Apple(6, Math.floor(tileCount / 2), 5);
	window.snake = new Snake(
		4,
		Math.floor(tileCount / 2),
		3,
		"rgb(50, 255, 50)"
	);

	highscore = storage._hscore || 0;

	setInterval(loop, 1000 / 90);
}

// Press any key to restart is implemented in keypressed function in events.js

function loop() {
	if (pause) return;

	// Background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	apple.draw(ctx);

	snake.update();
	snake.draw(ctx);

	drawText();

	if (snake.head.collides(apple)) {
		// Generates new position for the apple and
		// appends new bodypart to tail if the head hits/eats the apple
		apple.generateNew();
		snake.appendNew();
		score++;
	}

	if (score > highscore) {
		highscore = score;
		storage._hscore = highscore;
	}
}

function drawText() {
	ctx.font = scl * 1.5 + "px Arial";
	ctx.fillStyle = "#fff";
	ctx.fillText(
		score,
		canvas.width / 2 - ctx.measureText(score).width / 2,
		scl * 2.5
	);

	ctx.font = scl * 0.5 + "px Arial";
	ctx.fillStyle = "#fff";
	ctx.fillText(
		"High score: " + highscore,
		canvas.width / 2 -
		ctx.measureText("High score: " + highscore).width / 2,
		scl * 3.5
	);
}

// Init function will get called when the site is fully loaded
window.onload = init;

// events
window.keys = {};
window.mouse = { x: 0, y: 0, isDown: false };

const mousePressed = e => (mouse.isDown = true);
const mouseReleased = e => (mouse.isDown = false);

const keyPressed = e => {
	if (snake.isDead) window.location.reload();

	keys[e.key.toLowerCase()] = true;
};
const keyReleased = e => (keys[e.key.toLowerCase()] = false);

document.addEventListener("keydown", keyPressed);
document.addEventListener("keyup", keyReleased);

document.addEventListener("mousedown", mousePressed);
document.addEventListener("mouseup", mouseReleased);

document.addEventListener("mousemove", e => {
	let rect = canvas.getBoundingClientRect();
	[mouse.x, mouse.y] = [e.clientX - rect.left, e.clientY - rect.top];
});
