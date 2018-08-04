function trainNeuralNetwork(training){
  shuffle(training, true);
  for(let i = 0; i < training.length; i++){
    let data = training[i];

    let targets = [0, 0, 0, 0]; // CHANGE IN CASE OF ADDING EXTRA DATA

    let inputs = Array.from(data).map(x => x / 255);
    let label = training[i].label;
    targets[label] = 1;

    nn.train(inputs, targets);
  }
}


function testNeuralNetwork(testing){
  let correct = 0;
  for(let i = 0; i < testing.length; i++){
    let data = testing[i];
    let inputs = Array.from(data).map(x => x/255);
    let label = testing[i].label;
    let guess = nn.predict(inputs);

    let m = max(guess);
    let classification = guess.indexOf(m);
    if(classification === label) correct++;
  }
  let percentage = 100 * (correct / testing.length);
  return percentage;
}

function showImage(array_data){
  let total = 100;
  for(let n = 0; n < total; n++){
    let img = createImage(28, 28);
    img.loadPixels();
    let offset = n * IMG_BYTES;

    for(let i = 0; i < IMG_BYTES; i++){
      let val = 255 - array_data.bytes[i + offset];
      img.pixels[i * 4] = val;
      img.pixels[i * 4 + 1] = val;
      img.pixels[i * 4 + 2] = val;
      img.pixels[i * 4 + 3] = 255;
    }

    img.updatePixels();
    let x = (n % 10) * IMG_SIZE;
    let y = floor(n/10) * IMG_SIZE;
    image(img, x, y);
  }
}
