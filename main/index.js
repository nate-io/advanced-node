/*
  A normal app started with pm2 for performance.

  pm2 commands:
    - pm2 start <FILE> -i 0
      - start the selected file, -i 0 requests pm2 to start # of instances === machine logical cores
    - pm2 delete <NAME>
      - kill process with name
    - pm2 list 
      - list instances for health
    - pm2 show <NAME>
      - show more detailed stats on process
    - pm2 monit
      - cool CLI monitor feature for processes
*/
const express = require('express');
const app = express();
const PORT = 3000;
  
  app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('Hi there');
    });    
  });

  app.get('/fast', (req, res) => {
    res.send('Whoa so fast')
  })
  
  app.listen(PORT,  () => {
    console.log(`Listening on ${PORT}`)
  });