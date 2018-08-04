const TOTAL_LENGTH = 1000;
const IMG_SIZE = 28;
const IMG_BYTES = IMG_SIZE * IMG_SIZE;

const ANGEL = 0;
const BICYCLE = 1;
const OWL = 2;
const TURTLE = 3;

let angels_data;
let bicycles_data;
let owls_data;
let turtles_data;

let angels = {};
let bicycles = {};
let owls = {};
let turtles = {};

let nn;

function preload(){
  angels_data = loadBytes('data/angels1000.bin');
  bicycles_data = loadBytes('data/bicycle1000.bin');
  owls_data = loadBytes('data/owl1000.bin');
  turtles_data = loadBytes('data/turtle1000.bin');
}

function setup(){
  createCanvas(280, 280);
  background(51);

  nn = new NeuralNetwork(IMG_BYTES, 64, 4);

  divideDataset();
  let training = trainEpoch();

  trainNeuralNetwork(training);

  showImage(bicycles_data);

}

function trainNeuralNetwork(training){
  for(let i = 0; i < training.length ; i++){
    let targets = [0,0,0,0];
    let inputs = [];
    let label = training[i].label;

    for (let j = 0; j < IMG_BYTES; j++){
      inputs[j] = training[i][j] / 255.0 ;
    }
    targets[label] = 1;
    nn.train(inputs, targets);
  }
  console.log("Trained for one epoch");
}



function showImage(array_data){
  let total = 100;
  for(let n = 0; n < total; n++){
    let img = createImage(28, 28);
    img.loadPixels();
    let offset = n * IMG_BYTES;

    for(let i = 0; i < IMG_BYTES; i++){
      let val = 255 - array_data.bytes[i + offset];
      img.pixels[i * 4] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    }

    img.updatePixels();
    let x = (n % 10) * IMG_SIZE;
    let y = floor(n/10) * IMG_SIZE;
    image(img, x, y);
  }
}
