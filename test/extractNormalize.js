const test = require('tap').test;
const fs = require('fs');
const os = require('os');
const path = require('path');
const temp = require('temp');
const unzip = require('../');
const Stream = require('stream');


test("Extract should normalize the path option", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  temp.mkdir('node-unzip-normalize-', function (err) {
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
        cb();
        delayStream.emit('close');
      };

      return delayStream;
    }

    // don't use path.join, it will normalize the path which defeats
    // the purpose of this test
    const extractPath = os.tmpdir() + "/unzipper\\normalize/././extract\\test";

    const unzipExtractor = unzip.Extract({ getWriter: getWriter, path: extractPath });
    unzipExtractor.on('error', function(err) {
      throw err;
    });
    unzipExtractor.on('close', function() {
      t.same(filesDone, 2);
      t.end();
    });

    fs.createReadStream(archive).pipe(unzipExtractor);
  });
});

test("Extract should resolve after normalize the path option", function (t) {
  const archive = path.join(__dirname, '../testData/compressed-standard/archive.zip');

  temp.mkdir('node-unzip-normalize-2-', function (err) {
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
        cb();
        delayStream.emit('close');
      };

      return delayStream;
    }

    const unzipExtractor = unzip.Extract({ getWriter: getWriter, path: '.' });
    unzipExtractor.on('error', function(err) {
      throw err;
    });
    unzipExtractor.on('close', function() {
      t.same(filesDone, 2);
      t.end();
    });

    fs.createReadStream(archive).pipe(unzipExtractor);
  });
});