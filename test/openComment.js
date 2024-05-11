const test = require('tap').test;
const path = require('path');
const unzip = require('../');


test("get comment out of a zip", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-comment/archive.zip');

  unzip.Open.file(archive)
    .then(function(d) {
      t.equal('Zipfile has a comment', d.comment);
      t.end();
    });
});