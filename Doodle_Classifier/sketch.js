let angels_data;
let bicycles_data;
let owls_data;
let turtles_data;

let angels = {};
let bicycles = {};
let owls = {};
let turtles = {};

const TOTAL_LENGTH = 1000;
const IMG_SIZE = 28;
const IMG_BYTES = IMG_SIZE * IMG_SIZE;

function preload(){
  angels_data = loadBytes('data/angels1000.bin');
  bicycles_data = loadBytes('data/bicycle1000.bin');
  owls_data = loadBytes('data/owl1000.bin');
  turtles_data = loadBytes('data/turtle1000.bin');
}

function setup(){
  createCanvas(280, 280);
  background(51);
  setupObjects();
  divideDataset();

  showImage(bicycles_data);

}

function setupObjects(){
  angels.training = [];
  angels.testing = [];

  bicycles.training = [];
  bicycles.testing = [];

  owls.training = [];
  owls.testing = [];

  turtles.training = [];
  turtles.testing = [];
}


function divideDataset(){
    for(let i = 0; i < TOTAL_LENGTH; i++){
      let offset = i * IMG_BYTES;
      let treshold = floor(0.8 * TOTAL_LENGTH);

      if(i < treshold){
        angels.training[i] = angels_data.bytes.subarray(offset, offset + IMG_BYTES);
        bicycles.training[i] = bicycles_data.bytes.subarray(offset, offset + IMG_BYTES);
        owls.training[i] = owls_data.bytes.subarray(offset, offset + IMG_BYTES);
        turtles.training[i] = turtles_data.bytes.subarray(offset, offset + IMG_BYTES);

      }
      else{
        angels.testing[i - treshold] = angels_data.bytes.subarray(offset, offset + IMG_BYTES);
        bicycles.testing[i - treshold] = bicycles_data.bytes.subarray(offset, offset + IMG_BYTES);
        owls.testing[i - treshold] = owls_data.bytes.subarray(offset, offset + IMG_BYTES);
        turtles.testing[i - treshold] = turtles_data.bytes.subarray(offset, offset + IMG_BYTES);

      }
    }
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
