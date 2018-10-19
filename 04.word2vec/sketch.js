const xkcd_json = "https://raw.githubusercontent.com/fernand0aguilar/corpora/master/data/colors/xkcd.json";

let data;
let color_vectors;

function preload(){
	data = loadJSON(xkcd_json);
}

function processData(data){
	let vectors = {};
	let colors = data.colors;
	for (let i = 0; i < colors.length; i++){
		let label = colors[i].color;
		let rgb = color(colors[i].hex);
		vectors[label] = createVector(red(rgb), green(rgb), blue(rgb));
	}
	return vectors;
}

function setup() {
	noCanvas();
	color_vectors = processData(data);
	console.log(color_vectors);
}

function draw() {

}