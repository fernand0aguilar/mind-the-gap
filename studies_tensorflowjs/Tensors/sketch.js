const model = tf.sequential();

const configHidden = {
  units: 4,
  inputShape: [2],
  activation: 'sigmoid'
};
const hidden = tf.layers.dense(configHidden);

const configOutput = {
    units: 1,
    activation: 'sigmoid'
};
const output = tf.layers.dense(configOutput);


model.add(hidden);
model.add(output);

const sgdOpt = tf.train.sgd(0.1);

const config = {
  optimizer: sgdOpt,
  loss: tf.losses.adam
};
model.compile(config);

const inputs = tf.tensor2d([
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1]
]);

const outputs = tf.tensor2d([
  [0],
  [1],
  [1],
  [0]
]);

train().then(() => {
  let answer = model.predict(inputs);
  answer.print();
  console.log("Training complete!");
});


async function train(){
  for(let i = 0; i < 1000; i++){
    const config = {
      shuffle: true,
      epochs: 10
    }
    const response = await model.fit(inputs, outputs, config);
    console.log(response.history.loss[0]);
  }
}
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
