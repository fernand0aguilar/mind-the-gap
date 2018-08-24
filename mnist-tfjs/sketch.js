let model;

let testFile, trainFile;
let trainData, testData;

let trainButton, testButton;
let DATA_AMOUNT;
const IMG_SIZE = 784;


function preload() {
  trainFile = loadTable("zdata/train1001.csv", 'csv', 'header');
  // testFile = loadTable("zdata/test1001.csv", 'csv', 'header');
  testFile = trainFile;
  console.log(trainFile);
}


function handleButtons(){
  trainButton.mouseClicked(() => {
    trainModel(trainData);
  });

  testButton.mousePressed(() => {
    console.log("Testing");
    const result = model.evaluate(testData.xs, testData.ys, {batchSize: 30});
    result.print();
  });
}

function setup() {
  createCanvas(200, 200);
  background(0);
  DATA_AMOUNT = trainFile.rows.length;

  createModel();
  trainData = cleanData(trainFile);

  //TODO -> fix train data without label
  
  // testData = cleanData(trainFile);
  testData = trainData;

  trainButton = createButton("Train");
  testButton = createButton("Test");
}

function draw() {
  strokeWeight(8);
  stroke(255);

  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

  handleButtons();
}
