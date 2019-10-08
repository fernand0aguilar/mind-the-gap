let video;
let bodyPix;
let segmentedImage;

function setup() {
	createCanvas(320, 240);
	video = createCapture(VIDEO, videoReady);
	video.size(320, 240);
	console.log(bodyPix);
}

function modelReady() {
	console.log("model ready");
	bodyPix.segmentWithParts(gotResult);
}
function videoReady() {
	bodyPix = ml5.bodyPix(video, modelReady);
	console.log("video ready");
}

function gotResult(error, result) {
	if (error) {
		console.log(error);
		return;
	}
	//console.log(result);
	//image(result.image, 0, 0, width, height);
	segmentedImage = result.image;
	bodyPix.segmentWithParts(gotResult);
}


function draw() {
	background(255, 0, 255);
	noTint();
	image(video, 0, 0, width, height);

	tint(255, 200);
	if (segmentedImage != undefined){
		image(segmentedImage, 0, 0, width, height);
	}
	}