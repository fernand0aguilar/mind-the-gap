function divideDataset(){
  prepareData(angels, angels_data, ANGEL);
  prepareData(bicycles, bicycles_data, BICYCLE);
  prepareData(turtles, turtles_data, TURTLE);
  prepareData(owls, owls_data, OWL);
}

function trainEpoch(){
  let training = [];
  training = training.concat(angels.training);
  training = training.concat(bicycles.training);
  training = training.concat(turtles.training);
  training = training.concat(owls.training);

  return training;
}

function testData(){
  let testing = [];
  testing = testing.concat(angels.testing);
  testing = testing.concat(bicycles.testing);
  testing = testing.concat(turtles.testing);
  testing = testing.concat(owls.testing);

  return testing;
}

function prepareData(category, data, label){
  category.training = [];
  category.testing = [];

  for(let i = 0; i < TOTAL_LENGTH; i++){
    let offset = i * IMG_BYTES;
    let treshold = floor(0.8 * TOTAL_LENGTH);

    if(i < treshold){
      category.training[i] = data.bytes.subarray(offset, offset + IMG_BYTES);
      category.training[i].label = label;
    }
    else{
      category.testing[i - treshold] = data.bytes.subarray(offset, offset + IMG_BYTES);
      category.testing[i - treshold].label = label;
    }
  }
}
