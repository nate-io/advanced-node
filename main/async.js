const https = require('https');

const start = Date.now();

function doRequest() {
  https
    .request('https://www.google.com', res => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log(Date.now() - start)
      });
    })
    .end();
}

// networking is delegated to OS by Node
// so these requests will occur near simultaneously based on OS resources
for(let x = 0; x < 100; x++) {
  doRequest();
}