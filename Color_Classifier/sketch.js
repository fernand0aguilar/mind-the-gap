let data;
let model;

function preload() {
  data = loadJSON('./zdata/colorData.json');
}

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

function setup() {
  let colors = [];
  let labels = [];

  for (let record of data.entries) {
    let normalizedColor = [record.r / 255, record.g / 255, record.b / 255];
    colors.push(normalizedColor);
    labels.push(labelList.indexOf(record.label));
  }
  let labelsTensor = tf.tensor1d(labels, 'int32');

  let xs = tf.tensor2d(colors);
  let ys = tf.oneHot(labelsTensor, 9);

  labelsTensor.dispose();

  xs.print();
  ys.print();


  //Tensorflow neural network 3 inputs, 16 hidden, 9 outputs
  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 16,
    activation: 'sigmoid',
    inputDim: [3]
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

  // model.fit(xs, ys);
  // const
  // i love you

}
