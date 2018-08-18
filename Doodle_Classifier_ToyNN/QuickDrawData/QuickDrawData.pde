final int IMAGE_SIZE = 28;
final int IMAGE_BYTE = IMAGE_SIZE * IMAGE_SIZE;
final int START = 80;
final int TOTAL = 1000;
final String FILENAME = "turtle";

size(280, 280);

byte[] data = loadBytes(FILENAME + ".npy");
byte[] outdata = new byte[TOTAL * IMAGE_BYTE];
int outindex = 0;

for (int n = 0; n < TOTAL; n++) {
  PImage img = createImage(IMAGE_SIZE, IMAGE_SIZE, RGB);
  img.loadPixels();
  int beginning = START + (n * IMAGE_BYTE);

  for (int i = 0; i < IMAGE_BYTE; i++) {
    int index = i + beginning;
    byte val = data[index];
    outdata[outindex] = val;
    outindex++;
    img.pixels[i] = color(255 - val & 0xff );
  }

  img.updatePixels();
  int x = IMAGE_SIZE * (n % 10);
  int y = IMAGE_SIZE * (n / 10);
  image(img, x, y);
}

saveBytes( FILENAME + "1000.bin", outdata);
