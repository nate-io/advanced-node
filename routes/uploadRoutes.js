const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-east-2'
});

/*
  This route allows us to use our server to request a 
  signed URL from S3 for a given file. 
  
  We then pass the signed URL back to the client and allow the user's device to upload the image instead of hitting out server with the binary and passing to
  S3.

  The signed URL only allows the originally selected file to be uploaded and has a timeout. Bypassing our server to upload offers a large cost savings and 
  passes that work to S3 which can handle the load w/o issue.

  Note: S3 is flat file storage. Setting the key as userId/uuid is a workaround to namespace files with a user id; S3 then interprets the object as belonging
  to a 'folder' named after the user id.
*/
module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'my-blogster-app-123',
        ContentType: 'image/jpeg',
        Key: key
      },
      (err, url) => res.send({ key, url })
    );
  });
};