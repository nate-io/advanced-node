/**
 * PSEUDO IMPLEMENTATION OF NODE EVENT LOOP 
 *  node program named myFile.js
 * */ 

// node myFile.js

// call stacks for node checks @ shouldContinue
const pendingTimers = [];
const pendingOsTasks = [];
const pendingOperations = [];

// new timers, tasks, operations recorded from myFile running 
// includes imported/required files
myFile.runContents();

// node makes 3 checks for a sentinel
function shouldContinue() {
  // Check one: Any pending setTimeout, setInterval, setImmediate?
  // Check two: And pending OS tasks? (e.g., server listening to a port)
  // Check three: And pending long running operations? (e.g., fs module ops)
  return pendingTimers.length || pendingOsTasks.length || pendingOperations.length
}

// the event loop - whole body executes in one tick
while(shouldContinue()) {
  // 1) Node looks at pendingTimers and see if any functions
  // are ready to be called. setTimout & setImmediate

  // 2) Node looks at pendingOsTasks and pendingOperations
  // and calls relevant callbacks

  // 3) Pause execution. Continue when...
  //  - a new pendingOsTask is done
  //  - a new pendingOperation is done
  //  - a timer is about to complete

  // 4) look at pendingTimers, call any setImmediate

  // 5) Handle any 'close' events (think streams on('close') events)
}


// END & exit back to terminal