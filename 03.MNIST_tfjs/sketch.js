let model;

let testFile, trainFile;
let trainData, testData;

let trainButton, testButton, guessButton, clearbutton;
let pred;

const IMG_SQUARE = 28;
const IMG_SIZE = IMG_SQUARE * IMG_SQUARE;
let DATA_AMOUNT;


function preload() {
  trainFile = loadTable("zdata/train10001.csv", 'csv', 'header');
  // testFile = loadTable("zdata/test1001.csv", 'csv', 'header');
  testFile = trainFile;
}


function handleButtons(){
  trainButton.mouseClicked(() => {
    trainModel(trainData);
  });

  testButton.mousePressed(() => {
    console.log("Testing");
    const result = model.evaluate(testData.xs, testData.ys, {batchSize: 30});
    result.print();
  });

  guessButton.mousePressed(() => {
    guess();
  });

  clearbutton.mousePressed(() => {
    background(0);
  });
}

function setup() {
  createCanvas(280, 280);
  background(0);
  DATA_AMOUNT = trainFile.rows.length;

  createModel();
  trainData = cleanData(trainFile);

  //TODO -> fix train data without label
  // testData = cleanData(trainFile);
  testData = trainData;

  trainButton = createButton("Train");
  testButton = createButton("Test");
  guessButton = createButton("Guess");
  clearbutton = createButton("Clear")
  pred = select("#prediction");
}

function guess(){
  let inputs = [];
  let img = get();
  img.resize(IMG_SQUARE, IMG_SQUARE);
  img.loadPixels();
  for (let i = 0; i < IMG_SIZE; i++) {
    let bright = img.pixels[i * 4];
    inputs[i] = (bright) / 255.0;
  }
  let xs = tf.tensor2d(inputs, [1, 784]);
  const guess = model.predict(xs);
  let prediction = guess.argMax(1).dataSync()[0];

  pred.html("Number: " + prediction);
}

function draw() {
  strokeWeight(8);
  stroke(255);

  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
  tf.tidy(() => {
    handleButtons();
  });
}

function cleanData(data){
  let values = [];
  let labels = [];

  for (let i = 0; i < data.rows.length; i++){
    let number = data.rows[i];
    labels.push(number.arr.shift());
    values.push(number.arr);
  }

  let labelsTensor = tf.tensor1d(labels, 'int32');
  const xs = tf.tensor2d(values, [DATA_AMOUNT, IMG_SIZE] ,'int32');
  const ys = tf.oneHot(labelsTensor, 10);

  labelsTensor.dispose();

  return {xs, ys};
}

//TODO -> [3,3,10] conv, [1,1,1] conv, [,256] dense, [,10] dense, batch size 56, epochs 13
function createModel(){
  model = tf.sequential();

  const hidden = tf.layers.dense({
    inputDim: 784,
    units: 18,
    activation: 'sigmoid'
  });

  const output = tf.layers.dense({
    units: 10,
    activation: 'softmax'
  });

  model.add(hidden);
  model.add(output);

  const LEARNING_RATE = 0.09;
  const opt = tf.train.sgd(LEARNING_RATE);

  const config = {
    optimizer: opt,
    loss: 'categoricalCrossentropy'
  };

  model.compile(config);
}

async function trainModel(data){
  const options = {
    epochs: 30,
    shuffle: true,
    batchSize: 90,
    callbacks: {
      onTrainBegin: () => console.log("Training Started"),
      onTrainEnd: () => console.log("Training Completed"),
      onEpochEnd: async(num, logs) => {
        console.log("Epoch: " + (num+1) + " - Loss: " + logs.loss);
      }
    }
  };

  return await model.fit(data.xs, data.ys, options);
}
