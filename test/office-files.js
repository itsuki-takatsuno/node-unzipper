const test = require('tap').test;
const path = require('path');
const unzip = require('../');

test("get content a docx file without errors", async function () {
  const archive = path.join(__dirname, '../testData/office/testfile.docx');

  const directory = await unzip.Open.file(archive);
  await Promise.all(directory.files.map(file => file.buffer()));
});

test("get content a xlsx file without errors", async function () {
  const archive = path.join(__dirname, '../testData/office/testfile.xlsx');

  const directory = await unzip.Open.file(archive);
  await Promise.all(directory.files.map(file => file.buffer()));
});