let testData;
let trainData;

const IMG_SIZE = 784;

let trainTensor, testTensor;

function preload() {
  // testData = loadTable("zdata/example.csv", "csv", "header");
  trainData = loadTable("zdata/train1001.csv", 'csv', 'header');
  // testData = await loadTable("zdata/test1.csv", 'csv', 'header');
}


function setup() {
  createCanvas(200, 200);
  background(0);

  // console.log(trainData);
  const CHUNK = trainData.rows.length;
  const shape = [CHUNK, IMG_SIZE];

  let values = [];
  let labels = [];

  for (let i = 0; i < CHUNK; i++) {
    labels.push(trainData.rows[i].arr.shift());
    values[i] = trainData.rows[i].arr;
  }
  const example = tf.tensor2d(values, shape, 'int32');
  example.print();

  example.dispose();
}

function draw() {
  strokeWeight(8);
  stroke(255);

  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}
