let xArray = [];
let yArray = [];

let a, b, c;

const learningRate = 0.15;
const optimizer = tf.train.adam(learningRate);

let dragging = false;

function setup() {
  createCanvas(444, 444);

  a = tf.variable(tf.scalar(random(-1, 1)));
  b = tf.variable(tf.scalar(random(-1, 1)));
  c = tf.variable(tf.scalar(random(-1, 1)));
}

function draw() {
  background(0);

  if (xArray.length > 0 && !dragging) {
    tf.tidy(() => {
      const tensorY = tf.tensor1d(yArray);
      optimizer.minimize(() => loss(predict(xArray), yArray));
    });
  }

  drawPoints();
  tf.tidy(() => drawCurve());
}


function predict(xArray) {
  const tensorX = tf.tensor1d(xArray);
  // y = ax2+bx+c
  const predictions = tensorX.square().mul(a)
    .add(tensorX.mul(b))
    .add(c);

  return predictions;
}

function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function drawPoints(){
  stroke(255);
  strokeWeight(4);
  for (let i = 0; i < xArray.length; i++) {
    let px = map(xArray[i], -1, 1, 0, width);
    let py = map(yArray[i], -1, 1, height, 0);
    point(px, py);
  }
}

function drawCurve() {
  let curveX = [];
  for (let x = -1; x < 1.01; x += 0.05) {
    curveX.push(x);
  }

  const ys = predict(curveX);
  let curveY = ys.dataSync();

  beginShape();
  noFill();
  strokeWeight(2);
  stroke(255);
  for (let i = 0; i < curveX.length; i++) {
    let xCoordinate = map(curveX[i], -1, 1, 0, width);
    let yCoordinate = map(curveY[i], -1, 1, height, 0);
    vertex(xCoordinate, yCoordinate);
  }
  endShape();
}


function mousePressed(){
  dragging = true;
}

function mouseReleased(){
  dragging = false;
}

function mouseDragged() {
  let x = map(mouseX, 0, width, -1, 1);
  let y = map(mouseY, 0, height, 1, -1);
  xArray.push(x);
  yArray.push(y);
}
