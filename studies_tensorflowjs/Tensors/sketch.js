function setup(){
  noCanvas();

  const values = [];
  const shape = [2, 5, 3];

  for(let i = 0; i < 30; i++){
    values[i] = random(0, 100);
  }

  const tenso = tf.tensor(values, shape, 'int32');

  tenso.print(tenso.data());
}
