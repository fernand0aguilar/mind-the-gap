let colorByLabel = {
  'blue-ish': [],
  'green-ish': [],
  'pink-ish': [],
  'grey-ish': [],
  'red-ish': [],
  'purple-ish': [],
  'brown-ish': [],
  'orange-ish': [],
  'yellow-ish': [],
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize Firebase
  initDatabase();

  let label = 'red-ish';
}
