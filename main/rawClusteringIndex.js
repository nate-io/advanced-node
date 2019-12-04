const cluster = require('cluster');
const express = require('express');
const app = express();
const PORT = 3000;

/*
  Demonstrate the cluster module to fork child processes
*/

// master runs first and can spawn children on demand with fork()
console.log(cluster.isMaster)

// blocking the main thread at root :(
function doWork(duration) {
  const start = Date.now();

  while(Date.now() - start < duration) {}
}

if (cluster.isMaster) {
  // cause a new child to spawn
  cluster.fork(); // doing so once will allow the block to continue even on route /fast
} else {
  // this is a child of master and is a normal instance of app code
  
  app.get('/', (req, res) => {
    doWork(5000);
    res.send('Hi there');
  });

  app.get('/fast', (req, res) => {
    res.send('Whoa so fast')
  })
  
  app.listen(PORT,  () => {
    console.log(`Listening on ${PORT}`)
  });
}