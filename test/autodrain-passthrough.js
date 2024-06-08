const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const unzip = require('../');

test("verify that immediate autodrain does not unzip", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  fs.createReadStream(archive)
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
      entry.autodrain()
        .on('finish', function() {
          t.equal(entry.__autodraining, true);
        });
    })
    .on('finish', function() {
      t.end();
    });
});

test("verify that autodrain promise works", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  fs.createReadStream(archive)
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
      entry.autodrain()
        .promise()
        .then(function() {
          t.equal(entry.__autodraining, true);
        });
    })
    .on('finish', function() {
      t.end();
    });
});

test("verify that autodrain resolves after it has finished", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  fs.createReadStream(archive)
    .pipe(unzip.Parse())
    .on('entry', entry => entry.autodrain())
    .on('end', () => t.end());
});
