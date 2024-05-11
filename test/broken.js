const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const temp = require('temp');
const unzip = require('../');


test("Parse a broken zipfile", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/broken.zip');

  fs.createReadStream(archive)
    .pipe(unzip.Parse())
    .on('entry', function(entry) {
      return entry.autodrain();
    })
    .promise()
    .catch(function(e) {
      t.same(e.message, 'FILE_ENDED');
      t.end();
    });
});


test("extract a broken", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/broken.zip');

  temp.mkdir('node-unzip-', function (err, dirPath) {
    if (err) {
      throw err;
    }
    const unzipExtractor = unzip.Extract({ path: dirPath });

    fs.createReadStream(archive)
      .pipe(unzipExtractor)
      .promise()
      .catch(function(e) {
        t.same(e.message, 'FILE_ENDED');
        t.end();
      });
  });
});