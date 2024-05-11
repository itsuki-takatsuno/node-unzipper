const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const unzip = require('../');

test("parse an archive that has a file that falls on a chunk boundary", {
  timeout: 2000,
}, function (t) {


  const archive = path.join(__dirname, '../testData/chunk-boundary/chunk-boundary-archive.zip');

  // Use an artificially low highWaterMark to make the edge case more likely to happen.
  fs.createReadStream(archive, { highWaterMark: 3 })
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
      return entry.autodrain();
    }).on("finish", function() {
      t.ok(true, 'file complete');
      t.end();
    });
});