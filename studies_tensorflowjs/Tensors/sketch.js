const model = tf.sequential();

const configHidden = {
  units: 4,
  inputShape: [2],
  activation: 'sigmoid'
};
const hidden = tf.layers.dense(configHidden);

const configOutput = {
    units: 3,
    inputShape: [4],
    activation: 'sigmoid'
};
const output = tf.layers.dense(configOutput);


model.add(hidden);
model.add(output);

const sgdOpt = tf.train.sgd(0.1);
const config = {
  optimizer: sgdOpt,
  loss: 'meanSquaredError'
};
model.compile(config);
// function setup(){
//   noCanvas();
//
//   const values = [];
//   const shape = [2, 5, 3];
//
//   for(let i = 0; i < 30; i++){
//     values[i] = random(0, 100);
//   }
//
//   const tenso = tf.tensor(values, shape, 'int32');
//
//   // tenso.print(tenso.data());
// }
