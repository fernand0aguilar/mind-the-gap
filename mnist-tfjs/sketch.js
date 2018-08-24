let testData;
let trainData;
let model;

let xs, ys;

const IMG_SIZE = 784;

function preload() {
  // testData = loadTable("zdata/example.csv", "csv", "header");
  trainData = loadTable("zdata/train1001.csv", 'csv', 'header');
  // testData = loadTable("zdata/test1001.csv", 'csv', 'header');
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
  xs = tf.tensor2d(values);
  ys = tf.oneHot(labelsTensor, 10);

  labelsTensor.dispose();
}

//TODO -> [3,3,10] conv, [1,1,1] conv, [,256] dense, [,10] dense, batch size 56, epochs 13
function createModel(){
  model = tf.sequential();

  const hidden = tf.layers.dense({
    inputShape: [784],
    units: 3,
    activation: 'sigmoid'
  });

  const output = tf.layers.dense({
    units: 10,
    activation: 'softmax'
  });

  model.add(hidden);
  model.add(output);

  const config = {
    optimizer: tf.train.sgd(0.25),
    loss: 'meanSquaredError'
  }

  model.compile(config);
}

async function trainModel(){
  const options = {
    epochs: 9,
    shuffle: true,
    batchSize: 56,
    callbacks: {
      onTrainBegin: () => console.log("Training Started"),
      onTrainEnd: () => console.log("Training Completed"),
      onEpochEnd: async(num, logs) => {
        console.log("Epoch: " + num);
        console.log("Loss: " + logs.loss);
      }
    }
  };

  return await model.fit(xs, ys, options);
}

function handleButtons(){
  let trainButton = createButton("Train");
  let testButton = createButton("Test");

  trainButton.mouseClicked(() => {
    console.log("bor");
  });
  testButton.mousePressed(() => {
    console.log("boleta");
  });
}

function setup() {
  createCanvas(200, 200);
  background(0);
  cleanData(trainData);

  handleButtons();

  createModel();
  // trainModel();

  //console.log(xs.shape);
  // const example = tf.tensor2d(values, shape, 'int32');
  // example.dispose();
}

function draw() {
  strokeWeight(8);
  stroke(255);

  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
