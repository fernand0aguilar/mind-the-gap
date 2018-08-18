let xArray = [];
let yArray = [];

let m, b;

const learningRate = 0.3;
const optimizer = tf.train.sgd(learningRate);

function setup(){
  createCanvas(300, 300);

  m = tf.variable(tf.scalar(random(1)));
  b = tf.variable(tf.scalar(random(1)));
}

function mousePressed(){
  let x = map(mouseX, 0, width, 0, 1);
  let y = map(mouseY, 0, height, 1, 0);
  xArray.push(x);
  yArray.push(y);
}

function draw(){
  background(0);

  if(xArray.length > 0){
    tf.tidy(() => {
      const tensorY = tf.tensor1d(yArray);
      optimizer.minimize(() => loss(predict(xArray), yArray));
    });
  }

  stroke(255);
  strokeWeight(4);
  for(let i = 0; i < xArray.length; i++){
    let px = map(xArray[i], 0, 1, 0, width);
    let py = map(yArray[i], 0, 1, height, 0);
    point(px, py);
  }

  tf.tidy(() => drawLine());
}

function predict(xArray){
  const tensorX = tf.tensor1d(xArray);
  const predictions = tensorX.mul(m).add(b);   // y = mx+b
  return predictions;
}

function loss(pred, labels){
  return pred.sub(labels).square().mean();
}

function drawLine(){
  let lineX = [0, 1];
  const ys = predict(lineX);

  let lineY = ys.dataSync();

  let x1 = map(lineX[0], 0, 1, 0, width);
  let x2 = map(lineX[1], 0, 1, 0, width);

  let y1 = map(lineY[0], 0, 1, height, 0);
  let y2 = map(lineY[1], 0, 1, height, 0);

  strokeWeight(2);
  line(x1, y1, x2, y2);
}
