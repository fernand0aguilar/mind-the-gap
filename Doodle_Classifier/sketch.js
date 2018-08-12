const TOTAL_LENGTH = 1000;
const IMG_SIZE = 28;
const IMG_BYTES = IMG_SIZE * IMG_SIZE;

const ANGEL = 0;
const BICYCLE = 1;
const TURTLE = 2;
const OWL = 3;

let angels_data;
let bicycles_data;
let turtles_data;
let owls_data;

let angels = {};
let bicycles = {};
let turtles = {};
let owls = {};

let nn;

function preload() {
  angels_data = loadBytes('data/angels1000.bin');
  bicycles_data = loadBytes('data/bicycle1000.bin');
  turtles_data = loadBytes('data/turtle1000.bin');
  owls_data = loadBytes('data/owl1000.bin');
}

function setup() {
  createCanvas(420, 420);
  background(255);
  nn = new NeuralNetwork(784, 64, 4);

  divideDataset();

  let trainButton = select('#train');
  let testButton = select('#test');
  let guessButton = select('#guess');
  let clearButton = select('#clear');

  handleButtons(trainButton, testButton, guessButton, clearButton);

}

function draw() {
  strokeWeight(8);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
