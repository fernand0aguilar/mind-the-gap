// TODO -> Refactor
// Load model on beginning
// Post on github pages.


let data;
let model;
let xs, ys;
let rSlider, gSlider, bSlider;
let labelP;
let lossP;
let canvas;
let graph;
let saveBtn, loadBtn, trainBtn;
let lossX = [];
let lossY = [];
let accY = [];
let istraining;


let labelList = [
  'red-ish',
  'green-ish',
  'blue-ish',
  'orange-ish',
  'yellow-ish',
  'pink-ish',
  'purple-ish',
  'brown-ish',
  'grey-ish'
]

function preload() {
  data = loadJSON('zdata/colorData.json');
}

async function loadMd() {
  console.log("Load");
  if (localStorage.length > 0) {
    const LEARNING_RATE = 0.25;
    const optimizer = tf.train.sgd(LEARNING_RATE);
    let item = Number(localStorage.getItem('saveNo'));
    model = await tf.loadModel(`indexeddb://colorClassifier-${item}`);
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  } else {
    alert('No previous models saved!');
  }
}

async function saveModel() {
  console.log("Save");
  if (localStorage.length > 0) {
    let item = Number(localStorage.getItem('saveNo'));
    await model.save(`indexeddb://colorClassifier-${item + 1}`);
    localStorage.setItem('saveNo', item + 1);
  } else {
    await model.save(`indexeddb://colorClassifier-1`);
    localStorage.setItem('saveNo', 1);
  }
}

function setup() {
  // Crude interface
  canvas = createCanvas(200, 200);
  graph = document.getElementById('graph');
  labelP = select('#prediction');
  lossP = select('#loss');
  rSlider = select('#red-slider');
  gSlider = select('#green-slider');
  bSlider = select('#blue-slider');
  saveBtn = select('#save');
  loadBtn = select('#load');
  trainBtn = select('#train');

  canvas.parent('rgb-Canvas');
  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    let col = [record.r / 255, record.g / 255, record.b / 255];
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }

  xs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, 'int32');

  ys = tf.oneHot(labelsTensor, 9).cast('float32');
  labelsTensor.dispose();

  model = buildModel();

  //Methods for loading and saving the color classifier
  saveBtn.mouseClicked(saveModel);
  loadBtn.mouseClicked(loadMd);

  // Method for training the model
  istraining = false;
  trainBtn.mouseClicked(train);
}

async function train() {
  if (istraining) {
    return;
  }
  istraining = true;
  // This is leaking https://github.com/tensorflow/tfjs/issues/457
  await model.fit(xs, ys, {
    shuffle: true,
    validationSplit: 0.1,
    epochs: 10,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(epoch);
        lossY.push(logs.val_loss.toFixed(2));
        accY.push(logs.val_acc.toFixed(2));
        lossX.push(lossX.length + 1);
        lossP.html('Loss: ' + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        istraining = false;
        console.log('finished');
      },
    },
  });
}

function buildModel() {
  let md = tf.sequential();
  const hidden = tf.layers.dense({
    units: 15,
    inputShape: [3],
    activation: 'sigmoid'
  });

  const output = tf.layers.dense({
    units: 9,
    activation: 'softmax'
  });
  md.add(hidden);
  md.add(output);

  const LEARNING_RATE = 0.25;
  const optimizer = tf.train.sgd(LEARNING_RATE);

  md.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return md
}

function plotTraining() {
  let layout = {
    width: 600,
    height: 300,
    title: 'Graph of learning progress',
    xaxis: {
      title: 'No. of Epochs'
    }
  };

  let loss = {
    x: lossX,
    y: lossY,
    name: 'Val Loss'
  };

  let acc = {
    x: lossX,
    y: accY,
    name: 'Val Accuracy'
  };

  Plotly.newPlot(graph, [loss, acc], layout);
}
function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);
  //strokeWeight(2);
  //stroke(255);
  //line(frameCount % width, 0, frameCount % width, height);
  tf.tidy(() => {
    const input = tf.tensor2d([
      [r, g, b]
    ]);
    let results = model.predict(input);
    let argMax = results.argMax(1);
    let index = argMax.dataSync()[0];
    let label = labelList[index];
    labelP.html("Color: " + label);
  });

  plotTraining();
}




// let data;
// let model;
// let xs, ys;
//
// let isDataLoaded = false;
//
// const labelList = [
//   'red-ish',
//   'blue-ish',
//   'green-ish',
//   'pink-ish',
//   'purple-ish',
//   'grey-ish',
//   'brown-ish',
//   'orange-ish',
//   'yellow-ish'
// ];
//
// function preload() {
//   data = loadJSON('./zdata/colorData.json');
//   if(data != undefined){
//     console.log("data loaded with success");
//     isDataLoaded = true;
//   }
// }
//
//
// function setup() {
//   let canvas = select("#rgb-Canvas");
//
//   tf.tidy(() => {
//     cleanData();
//     createModel();
//   });
// }
//
// function draw(){
//
//   let r = select("#red-slider").value();
//   let g = select("#green-slider").value();
//   let b = select("#blue-slider").value();
//
//   let colorPrediction = select("#prediction");
//   let index;
//
//   tf.tidy(() => {
//     const input = tf.tensor2d([
//       [r, g, b]
//     ]);
//     let results = model.predict(input);
//     let argMax = results.argMax(1);
//     let index = argMax.dataSync()[0];
//     let label = labelList[index];
//     labelP.html("Color: " + label);
//   });
//
//   plotTraining();
// }
//
//
// function plotTraining() {
//   let layout = {
//     width: 600,
//     height: 300,
//     title: 'Graph of learning progress',
//     xaxis: {
//       title: 'No. of Epochs'
//     }
//   };
//
//   let loss = {
//     x: lossX,
//     y: lossY,
//     name: 'Val Loss'
//   };
//
//   let acc = {
//     x: lossX,
//     y: accY,
//     name: 'Val Accuracy'
//   };
//
//   Plotly.newPlot(graph, [loss, acc], layout);
// }
//
// /**
// Gets all the entries,
// normalize rgb colors,
// make onehot output;
// **/
// function cleanData(){
//   let colors = [];
//   let labels = [];
//
//   for (let record of data.entries) {
//     let normalizedColor = [record.r / 255, record.g / 255, record.b / 255];
//     colors.push(normalizedColor);
//     labels.push(labelList.indexOf(record.label));
//   }
//   let labelsTensor = tf.tensor1d(labels, 'int32');
//
//   xs = tf.tensor2d(colors);
//   ys = tf.oneHot(labelsTensor, 9);
//
//   labelsTensor.dispose();
// }
//
// /**
// Make a dense neural Network
// shape the hidden & output layer
// Add them to the model
// // 3 inputs, 16 hidden, 9 outputs
// **/
// function createModel() {
//   model = tf.sequential();
//
//   let hidden = tf.layers.dense({
//     units: 4,
//     activation: 'sigmoid',
//     inputDim: 3
//   });
//
//   let output = tf.layers.dense({
//     units: 9,
//     activation: 'softmax'
//   });
//
//   model.add(hidden);
//   model.add(output);
//
//   const LEARNING_RATE = 0.25;
//   const opt = tf.train.sgd(LEARNING_RATE);
//
//   model.compile({
//     optimizer: opt,
//     loss: 'categoricalCrossentropy'
//   });
// }
//
//
// /**
// Heart of the code ->
// sets the configurations for each interaction
// adjust the weights
// **/
// async function trainModel() {
//   const options = {
//     epochs: 3,
//     validationSplit: 0.1,
//     shuffle: true,
//     callbacks: {
//       onTrainBegin: () => console.log("Training Started"),
//       onTrainEnd: () => console.log("Training Completed"),
//       onBatchEnd: tf.nextFrame,
//       onEpochEnd: async(num, logs) => {
//         console.log("Epoch: " + num);
//         console.log("Loss: " + logs.loss);
//       }
//     }
//   };
//
//   return await model.fit(xs, ys, options);
// }
