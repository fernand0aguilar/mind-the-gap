const xkcd_json = "https://raw.githubusercontent.com/fernand0aguilar/corpora/master/data/colors/xkcd.json";

let data, color_vectors;

let div, position;

function preload() {
	data = loadJSON(xkcd_json);
}

function setup() {
	createCanvas(180, 180);
	div = createDiv();

	color_vectors = processData(data);
	position = createVector(random(255), random(255), random(255));
	findNearestNeighbor(position);
}

function processData(data) {
	let vectors = {};
	let colors = data.colors;
	for (let i = 0; i < colors.length; i++) {
		let label = colors[i].color;
		let rgb = color(colors[i].hex);
		vectors[label] = createVector(red(rgb), green(rgb), blue(rgb));
	}
	data = null;
	return vectors;
}

function findNearestNeighbor(v) {
	let keys = Object.keys(color_vectors);

	keys.sort((a, b) => {
		let dist1 = p5.Vector.dist(v, color_vectors[a]);
		let dist2 = p5.Vector.dist(v, color_vectors[b]);
		return dist1 - dist2;
	});
	return keys[0];
}

function draw() {
	background(0);
	let colorName = findNearestNeighbor(position);
	let col = color_vectors[colorName];
	col = color(col.x, col.y, col.z);

	fill(col);
	ellipse(90, 90, 180)
	
	div.html(colorName);
	div.style("color", col);
	div.style("font-size", "6em");

	let r = p5.Vector.random3D();
	r.mult(60);
	position.add(r);
	frameRate(1);
}