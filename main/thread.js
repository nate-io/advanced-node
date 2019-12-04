/*
  Node is single threaded

  However, this is not exactly true. Application code runs in a single thread
  but, as seen in our pseudo event loop @ loop.js, there are three types of
  calls resulting from the Node internal architecture:

  App Code => Node.js => V8/Libuv => OS

  For instance, networking calls are delegated to the OS, fs calls will be delegated to libuv, etc. 

  App code does have a single thread but libuv is started by default with a
  THREADPOOL of 4 and can use CPU cores for hyperthreading. So when we read 
  a file from fs it is delegated to libuv and handled in slices. libuv is able
  to handle new tasks while long running operations are in process until they
  return. 

  This code calls an expensive crypto function in order to demonstrate Node using multiple cores because the results will return concurrently instead of one after the other. Another marker of concurrency is although they are fired off sequentially they will return in a random order (marked by the logged index)

  Due to the libuv threadpool size any number of calls up to the pool size will return roughly in the same amount of time. When the calls exceed the threadpool size the calls up to the pool size will return and others will be blocked awaiting processing. The first returned thread will then pick up the remainder of the available work until complete. 
*/

// how to modify the threadpool size for your process
// lowering it will make fewer threads run at a time 
// whereas increasing it will allow more threads to run at once 
// BUT they each get less processing time per cycle
// process.env.UV_THREADPOOL_SIZE = 5;

const crypto = require('crypto');
const start = Date.now();
const CALLS = 4

function doHash(x) {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`${x + 1}: ${Date.now() - start}`);
  });
}

for (let x = 0; x < CALLS; x++) {
  doHash(x);
}