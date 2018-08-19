let data;

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

}
