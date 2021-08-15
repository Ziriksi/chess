// Setup function
function setup() {
  window.__queue = [];
  // Wait.condition only works if you redefine it idfk why but I can put
  // it in the setup so it does it automatically :)
  Wait.condition = function(condition, callback, untilTrue, name) {
    __queue.push({
      frames: -1,
      condition: condition,
      callback: callback,
      untilTrue: untilTrue || function() {},
      name: name
    });
  };
}

// Calls a function after a certain number of frames pass
// Works like setTimeout() but uses frames instead of time
// <frames> | Number: The number of frames to wait
// <callback> | Function: The function to run after the specified number of frames
// <untilTrue> | Function: The function to run until the number of frames pass
// [name] | String: Gives the queued function a name so you can stop it at any time
function frame(frames, callback, untilTrue, name) {
  __queue.push({
    frames: frames,
    condition: function() {return false},
    callback: callback,
    untilTrue: untilTrue || function() {},
    name: name
  });
}

// The same as Wait.frame, but waits for a condition to be true instead of waiting for a number of frames
// <condition> | Function: The condition to wait for. Write as a function: function(){return <condition>}
// <callback> | Function: The function to run once the condition is met
// <untilTrue> | Function: The function to run until the condition is met
// [name] | String: Gives the queued function a name so you can stop it at any time
function condition(condition, callback, untilTrue, name) {
  __queue.push({
    frames: -1,
    condition: condition,
    callback: callback,
    untilTrue: untilTrue || function() {},
    name: name
  });
}

// Required for wait functions to work. Put this in the draw loop.
function loop() {
  for(var i = 0; i < __queue.length; i++) {
    __queue[i].frames--;
    if(__queue[i].frames === 0 || __queue[i].condition()) {
      __queue[i].callback();
      __queue.splice(i, 1);
      i--;
    } else {
      __queue[i].untilTrue();
    }
  }
}

// Stops any waiting functions with the specified name
// <name> | String: The name of functions to stop
function stop(name) {
  __queue = __queue.filter(function(w) {return w.name != name});
}

