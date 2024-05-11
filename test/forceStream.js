const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const Stream = require('stream');
const unzip = require('../');

test("verify that setting the forceStream option emits a data event instead of entry", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  let dataEventEmitted = false;
  let entryEventEmitted = false;
  fs.createReadStream(archive)
    .pipe(unzip.Parse({ forceStream: true }))
    .on('data', function(entry) {
      t.equal(entry instanceof Stream.PassThrough, true);
      dataEventEmitted = true;
    })
    .on('entry', function() {
      entryEventEmitted = true;
    })
    .on('finish', function() {
      t.equal(dataEventEmitted, true);
      t.equal(entryEventEmitted, false);
      t.end();
    });
});
