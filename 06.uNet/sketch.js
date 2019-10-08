let video;
let uNet;
let segmentedImage;

function preload() {
	uNet = ml5.uNet('face');
}

function gotResult(error, result) {
	if (error) {
		console.log(error);
		return;
	}
	//console.log(result);
	//image(result.image, 0, 0, width, height);
	segmentedImage = result.image;
	uNet.segment(video, gotResult);
}

function setup() {
	createCanvas(320, 240);
	video = createCapture(VIDEO, videoReady);
	video.size(320, 240);
	console.log(uNet);
}

function videoReady() {
	uNet.segment(video, gotResult);
}

function draw() {
	background(255, 0, 255);
	if (segmentedImage != undefined){
		segmentedImage.loadPixels();
			for (let i = 0; i < segmentedImage.pixels.length; i += 4) {
				let r = segmentedImage.pixels[i + 0];
				let g = segmentedImage.pixels[i + 1];
				let b = segmentedImage.pixels[i + 2];

				if (r == 0 && g == 0 && b == 0) {
					segmentedImage.pixels[i + 3] = 0;
				} else {
					segmentedImage.pixels[i + 0] = 0;
					segmentedImage.pixels[i + 1] = 0;
					segmentedImage.pixels[i + 2] = 255;
					
				}
			}
			segmentedImage.updatePixels();
		image(segmentedImage, 0, 0, width, height);
	}
	
}
