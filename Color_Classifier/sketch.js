let data;
let model;
let xs, ys;

let isDataLoaded = false;

const labelList = [
  'red-ish',
  'blue-ish',
  'green-ish',
  'pink-ish',
  'purple-ish',
  'grey-ish',
  'brown-ish',
  'orange-ish',
  'yellow-ish'
];

function preload() {
  data = loadJSON('./zdata/colorData.json');
  if(data != undefined){
    console.log("data loaded with success");
    isDataLoaded = true;
  }
}


function setup() {
  let canvas = select("#rgb-Canvas");
  // let canvasDiv = select("#rgb-Canvas");
  // canvasDiv.parent(canvas);

  tf.tidy(() => {
    cleanData();
    createModel();
    configModel();
  });
}

function draw(){

  let r = select("#red-slider").value();
  let g = select("#green-slider").value();
  let b = select("#blue-slider").value();

  let colorPrediction = select("#prediction");
  let index;

  tf.tidy(() => {
    const xs = tf.tensor2d([
      [r/255, g/255, b/255]
    ]);
    let results = model.predict(xs);
    index = results.argMax(1).dataSync()[0];
  });

  colorPrediction.html(`Color: ${labelList[index]}`);
  background(r, g, b);
}

/**
Gets all the entries,
normalize rgb colors,
make onehot output;
**/
function cleanData(){
  let colors = [];
  let labels = [];

  for (let record of data.entries) {
    let normalizedColor = [record.r / 255, record.g / 255, record.b / 255];
    colors.push(normalizedColor);
    labels.push(labelList.indexOf(record.label));
  }
  let labelsTensor = tf.tensor1d(labels, 'int32');

  xs = tf.tensor2d(colors);
  ys = tf.oneHot(labelsTensor, 9);

  labelsTensor.dispose();
}

/**
Make a dense neural Network
shape the hidden & output layer
Add them to the model
// 3 inputs, 16 hidden, 9 outputs
**/
function createModel() {
  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 16,
    activation: 'sigmoid',
    inputDim: 3
  });

  let output = tf.layers.dense({
    units: 9,
    activation: 'softmax'
  });

  model.add(hidden);
  model.add(output);
}

/**
optimize model with stochastic gradient descent
Compile it
**/
function configModel(){
  const LEARNING_RATE = 0.25;
  const opt = tf.train.sgd(LEARNING_RATE);

  model.compile({
    optimizer: opt,
    loss: 'categoricalCrossentropy'
  });
}

/**
Heart of the code ->
sets the configurations for each interaction
adjust the weights
**/
async function trainModel() {
  const options = {
    epochs: 3,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log("Training Started"),
      onTrainEnd: () => console.log("Training Completed"),
      onBatchEnd: tf.nextFrame,
      onEpochEnd: async(num, logs) => {
        console.log("Epoch: " + num);
        console.log("Loss: " + logs.loss);
      }
    }
  };

  return await model.fit(xs, ys, options);
}
