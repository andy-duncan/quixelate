const Jimp = require('jimp');

const width = 1000;
const r = 10;

const average = vs => vs.reduce((sum, e) => sum + e, 0) / vs.length;

Jimp.read('images/a.jpg', (err, image) => {
  if (err) throw err;
  image
    .resize(width, Jimp.AUTO)
    .scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      if ((x % r === 0) && (y % r === 0)) {
        const points = [...Array(r*r).keys()].map(i => {
          const row = Math.floor(i / r);
          const col = i % r;
          return ((x + col) * 4) + ((row + y) * width * 4);
        });
        const rs = average(points.map(p => this.bitmap.data[p]));
        const gs = average(points.map(p => this.bitmap.data[p + 1]));
        const bs = average(points.map(p => this.bitmap.data[p + 2]));

        points.forEach(p => {
          this.bitmap.data[p] = rs;
          this.bitmap.data[p + 1] = gs;
          this.bitmap.data[p + 2] = bs;
          this.bitmap.data[p + 3] = 1;
        });
      }
    })
    .write('images/a-modified.jpg');
});
