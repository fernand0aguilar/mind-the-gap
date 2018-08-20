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

  //Tensorflow neural network 3 inputs, 16 hidden, 9 outputs
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

  const LEARNING_RATE = 0.25;
  const opt = tf.train.sgd(LEARNING_RATE);

  model.compile({
    optimizer: opt,
    loss: 'categoricalCrossentropy'
  });

  if (isDataLoaded){
    trainModel().then(results => {
      console.log(results.history.loss);
    });
  }
}


async function trainModel() {
  const options = {
    epochs: 3,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log("Training Started"),
      onTrainEnd: () => console.log("Training Completed"),
      onEpochEnd: async(num, logs) => {
        await tf.nextFrame();
        console.log("Epoch: " + num);
        console.log("Loss: " + logs.loss);
      }
    }
  };

  return await model.fit(xs, ys, options);
}

function draw(){
  background(51);
  stroke(255, 0, 255);
  strokeWeight(3);
  line(frameCount % width, 0, frameCount % width, height);
  // ellipse(50, 50, )
}
