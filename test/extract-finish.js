const test = require('tap').test;
const fs = require('fs');
const os = require('os');
const path = require('path');
const temp = require('temp');
const unzip = require('../');
const Stream = require('stream');


test("Only emit finish/close when extraction has completed", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  temp.mkdir('node-unzip-finish-', function (err) {
    if (err) {
      throw err;
    }

    let filesDone = 0;

    function getWriter() {
      const delayStream = new Stream.Transform();

      delayStream._transform = function(d, e, cb) {
        setTimeout(cb, 500);
      };

      delayStream._flush = function(cb) {
        filesDone += 1;
        setTimeout(cb, 100);
        delayStream.emit('close');
      };

      return delayStream;
    }


    const unzipExtractor = unzip.Extract({ getWriter: getWriter, path: os.tmpdir() });
    unzipExtractor.on('error', function(err) {
      throw err;
    });
    unzipExtractor.promise().then(function() {
      t.same(filesDone, 2);
      t.end();
    });

    fs.createReadStream(archive).pipe(unzipExtractor);
  });
});