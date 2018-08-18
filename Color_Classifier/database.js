function initDatabase() {
  let config = {
    apiKey: "AIzaSyDPekCKX4ee6h9NVR2lEITGAM0XIHn-c7c",
    authDomain: "color-classification.firebaseapp.com",
    databaseURL: "https://color-classification.firebaseio.com",
    projectId: "color-classification",
    storageBucket: "",
    messagingSenderId: "590040209608"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  let ref = database.ref('colors');
  ref.once('value', gotData);
}


function gotData(results) {
  let data = results.val();
  let keys = Object.keys(data);

  // Processing data
  for (let key of keys) {
    let record = data[key];
    colorByLabel[record.label].push(record);
  }
  console.log("GOT DATA!");
  visualizeData(label);
}

function visualizeData(label){
  // Visualizing Data by Color Label
  let colorEntry = colorByLabel[label];
  let x = 0;
  let y = 0;
  for (let i = 0; i < colorEntry.length; i++) {
    noStroke();
    fill(colorEntry[i].r, colorEntry[i].g, colorEntry[i].b);
    rect(x, y, 10, 10);
    x += 10;
    if (x >= width) {
      x = 0;
      y += 10;
    }
  }
}
