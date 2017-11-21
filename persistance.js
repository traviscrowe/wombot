const aws = require('aws-sdk');
aws.config.loadFromPath('./aws.config.json');

class Persistance {
  constructor() {
    this.s3 = new aws.S3();
  }

  init(bucketName) {
    return new Promise((resolve, reject) => {
      this.bucketName = bucketName;
      this.s3.listObjectsV2({Bucket: this.bucketName}, (err, data) => {
        if (err) {
          this.s3.createBucket({Bucket: this.bucketName}, (err, data) => {
            if (err) {
              console.error('Could not load s3 bucket: ' + err);
              reject('Could not load s3 bucket: ' + err);
            }
            console.log('s3 bucket created.');
            resolve();
          })
        } else {
          console.log('s3 bucket loaded.');
          resolve();
        }
      });
    });
  }

  getObject(key) {
    return new Promise((resolve, reject) => {
      this.s3.getObject({ Bucket: this.bucketName, Key: key }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data.Body.toString('utf-8')));
        }
      });
    });
  }

  storeObject(key, obj) {
    return new Promise((resolve, reject) => {
      var body = JSON.stringify(obj);
      this.s3.putObject({ Bucket: this.bucketName, Key: key, Body: body}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    })
  }
}

module.exports = Persistance;