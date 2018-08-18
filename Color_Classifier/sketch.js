let filter = {
  'YGdqOTDDmrbGm80gM5UHicxMBgS2': true,
  'HUXmyv1dSSUnIvYk976MPWUSaTG2': true,
  'hPdk0Qpo0Gb5NsWSgxsqPM7M2EA2': true
};

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

let label = 'purple-ish';

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize Firebase
  initDatabase();

}
