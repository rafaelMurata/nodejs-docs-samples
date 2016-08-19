// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var fs = require('fs');
var path = require('path');
var Storage = require('@google-cloud/storage');
var uuid = require('node-uuid');
var filesExample = require('../files');

var storage = Storage();
var bucketName = 'nodejs-docs-samples-test-' + uuid.v4();
var fileName = 'test.txt';
var movedFileName = 'test2.txt';
var copiedFileName = 'test3.txt';
var filePath = path.join(__dirname, '../resources', fileName);
var downloadFilePath = path.join(__dirname, '../resources/downloaded.txt');

describe('storage:files', function () {
  before(function (done) {
    storage.createBucket(bucketName, done);
  });

  after(function (done) {
    try {
      fs.unlinkSync(downloadFilePath);
    } catch (err) {
      console.log(err);
    }
    storage.bucket(bucketName).deleteFiles({ force: true }, function (err) {
      if (err) {
        return done(err);
      }
      storage.bucket(bucketName).delete(done);
    });
  });

  describe('uploadFile', function () {
    it('should upload a file', function (done) {
      var options = {
        bucket: bucketName,
        srcFile: filePath
      };

      filesExample.uploadFile(options, function (err, file) {
        assert.ifError(err);
        assert(file);
        assert.equal(file.name, fileName);
        assert(console.log.calledWith('Uploaded gs://%s/%s', options.bucket, options.srcFile));
        done();
      });
    });
  });

  describe('downloadFile', function () {
    it('should download a file', function (done) {
      var options = {
        bucket: bucketName,
        srcFile: fileName,
        destFile: downloadFilePath
      };

      filesExample.downloadFile(options, function (err) {
        assert.ifError(err);
        assert.doesNotThrow(function () {
          fs.statSync(downloadFilePath);
        });
        assert(console.log.calledWith('Downloaded gs://%s/%s to %s', options.bucket, options.srcFile, options.destFile));
        done();
      });
    });
  });

  describe('moveFile', function () {
    it('should move a file', function (done) {
      var options = {
        bucket: bucketName,
        srcFile: fileName,
        destFile: movedFileName
      };

      filesExample.moveFile(options, function (err, file) {
        assert.ifError(err);
        assert.equal(file.name, movedFileName);
        assert(console.log.calledWith('Renamed gs://%s/%s to gs://%s/%s', options.bucket, options.srcFile, options.bucket, options.destFile));
        done();
      });
    });
  });

  describe('listFiles', function () {
    it('should list files', function (done) {
      filesExample.listFiles(bucketName, function (err, files) {
        assert.ifError(err);
        assert(Array.isArray(files));
        assert.equal(files.length, 1);
        assert.equal(files[0].name, movedFileName);
        assert(console.log.calledWith('Found %d file(s)!', files.length));
        done();
      });
    });
  });

  describe('copyFile', function () {
    it('should copy a file', function (done) {
      var options = {
        srcBucket: bucketName,
        srcFile: movedFileName,
        destBucket: bucketName,
        destFile: copiedFileName
      };

      filesExample.copyFile(options, function (err, file) {
        assert.ifError(err);
        assert.equal(file.name, copiedFileName);
        assert(console.log.calledWith('Copied gs://%s/%s to gs://%s/%s', options.srcBucket, options.srcFile, options.destBucket, options.destFile));
        done();
      });
    });
  });

  describe('listFilesByPrefix', function () {
    it('should list files by a prefix', function (done) {
      var options = {
        bucket: bucketName,
        prefix: 'test'
      };

      filesExample.listFilesByPrefix(options, function (err, files) {
        assert.ifError(err);
        assert(Array.isArray(files));
        assert.equal(files.length, 2);
        assert.equal(files[0].name, movedFileName);
        assert.equal(files[1].name, copiedFileName);
        assert(console.log.calledWith('Found %d file(s)!', files.length));

        options = {
          bucket: bucketName,
          prefix: 'foo'
        };

        filesExample.listFilesByPrefix(options, function (err, files) {
          assert.ifError(err);
          assert(Array.isArray(files));
          assert.equal(files.length, 0);
          assert(console.log.calledWith('Found %d file(s)!', files.length));
          done();
        });
      });
    });
  });

  describe('makePublic', function () {
    it('should make a file public', function (done) {
      var options = {
        bucket: bucketName,
        file: copiedFileName
      };

      filesExample.makePublic(options, function (err) {
        assert.ifError(err);
        assert(console.log.calledWith('Made gs://%s/%s public!', options.bucket, options.file));
        done();
      });
    });
  });

  describe('getMetadata', function () {
    it('should get metadata for a file', function (done) {
      var options = {
        bucket: bucketName,
        file: copiedFileName
      };

      filesExample.getMetadata(options, function (err, metadata) {
        assert.ifError(err);
        assert(metadata);
        assert.equal(metadata.name, copiedFileName);
        assert(console.log.calledWith('Got metadata for gs://%s/%s', options.bucket, options.file));
        done();
      });
    });
  });

  describe('deleteFile', function () {
    it('should delete a file', function (done) {
      var options = {
        bucket: bucketName,
        file: copiedFileName
      };

      filesExample.deleteFile(options, function (err) {
        assert.ifError(err);
        assert(console.log.calledWith('Deleted gs://%s/%s', options.bucket, options.file));
        done();
      });
    });
  });
});
