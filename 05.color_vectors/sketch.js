const xkcd_json = "https://raw.githubusercontent.com/fernand0aguilar/corpora/master/data/colors/xkcd.json";

let data, color_vectors;
let nietzsche, lines;

let div, position;


let all_colors = [];

function preload() {
	data = loadJSON(xkcd_json);
	lines = loadStrings('input.txt');
}

function setup() {
	noCanvas();
	color_vectors = processData(data);

	nietzsche = join(lines, ' ');
	let words = nietzsche.split(/\W+/);

	for(let word of words){		
		if(color_vectors[word]){
			let span = createSpan(word);
			all_colors.push(word);
			let c = color_vectors[word];
			span.style('background-color', `rgb(${c.x}, ${c.y}, ${c.z})`);
			createSpan(' ');
		}
	}
	// createP(nietzsche);
}

function draw() {
	background(0);
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
