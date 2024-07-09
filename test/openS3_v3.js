const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const unzip = require('../unzip');

const version = +process.version.replace('v', '').split('.')[0];

test("get content of a single file entry out of a zip", { skip: version < 16 }, function(t) {
  const { S3Client } = require('@aws-sdk/client-s3');
  const client = new S3Client({ region: 'us-east-1' });

  return unzip.Open.s3_v3(client, { Bucket: 'unzipper', Key: 'archive.zip' })
    .then(function(d) {
      const file = d.files.filter(function(file) {
        return file.path == 'file.txt';
      })[0];

      return file.buffer()
        .then(function(str) {
          const fileStr = fs.readFileSync(path.join(__dirname, '../testData/compressed-standard/inflated/file.txt'), 'utf8');
          t.equal(str.toString(), fileStr);
          t.end();
        });
    });
});
