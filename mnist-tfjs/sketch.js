let testFile, trainFile;
let model;

let trainData, testData;

let trainButton, testButton;

const IMG_SIZE = 784;
const DATA_AMOUNT = 10000;

function preload() {
  // testData = loadTable("zdata/example.csv", "csv", "header");
  trainFile = loadTable("zdata/train10001.csv", 'csv', 'header');
  testData = loadTable("zdata/test10001.csv", 'csv', 'header');
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
    units: 3,
    activation: 'sigmoid'
  });

  const output = tf.layers.dense({
    units: 10,
    activation: 'softmax'
  });

  model.add(hidden);
  model.add(output);

  const LEARNING_RATE = 0.03;
  const opt = tf.train.sgd(LEARNING_RATE);

  const config = {
    optimizer: opt,
    loss: 'categoricalCrossentropy'
  };

  model.compile(config);
}

async function trainModel(data){
  const options = {
    epochs: 12,
    shuffle: true,
    batchSize: 60,
    callbacks: {
      onTrainBegin: () => console.log("Training Started"),
      onTrainEnd: () => console.log("Training Completed"),
      onEpochEnd: async(num, logs) => {
        console.log("Epoch: " + num);
        console.log("Loss: " + logs.loss);
      }
    }
  };

  return await model.fit(data.xs, data.ys, options);
}

function testModel(data){
  const result = model.evaluate(data.xs, data.ys);
  result.print();
}

function handleButtons(){
  trainButton.mouseClicked(() => {
    trainModel(trainData);
  });

  testButton.mousePressed(() => {
    console.log("Testing");
    testModel(testData);
  });
}

function setup() {
  createCanvas(200, 200);
  background(0);

  createModel();
  trainData = cleanData(trainFile);
  testData = trainData;

  trainButton = createButton("Train");
  testButton = createButton("Test");

}

function draw() {
  strokeWeight(8);
  stroke(255);

  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

  handleButtons();
}
