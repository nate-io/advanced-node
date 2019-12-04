const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
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

function doHash(x) {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`${x + 1}: ${Date.now() - start}`);
  });
}

/*
  What is the expected return order of the below?
  My initial thought was doRequest, all 4 doHash then fs

  doRequest invokes OS operation
  readFile invokes libuv threadpool as do the hashing blocks

  On my machine my results over multiple tests were fs, request then the hash operations. 
  Instructor's machine results were request, one hash, FS, rest of hashes.

  For instructor the request completed ASAP because network request was fastest op regardless of the others then fs was invoked and, since fs calls actually make two trips to the file for a read (first to gather stats, second to read) then the process was offloaded in favor of a hash invocation. Node picked up one hash and the next op was the fs return (remember the wait period of the event loop) so the read was performed and then the rest of hashes were picked up.

  For me the readFile operation is taking ~40ms IN TOTAL due to my SSD so on my machine the order is FS, request, hashes.
*/

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
  console.log(`FS: ${Date.now() - start}`)
});

doHash(0);
doHash(1);
doHash(2);
doHash(3);