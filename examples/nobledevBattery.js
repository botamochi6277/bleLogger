var batteryDev = require("./batteryDev");
var async = require('async');


batteryDev.discover(function(device) {
  console.log('found ' + device.id);

  // console.log('name ' + device.is);
  console.log('name ' + device.name);
  console.log('uuid ' + device.uuid);
  console.log('address ' + device.address);
  console.log('addressType ' + device.addressType);
  // console.log('SCAN_UUIDS ' + );
  // you can be notified of disconnects
  device.on('disconnect', function() {
    console.log('we got disconnected! :( ');
    process.exit(0);
  });

  // you'll need to call connect and set up
  device.connectAndSetUp(function(error) {

    device.receive(function(error, data) {
      console.log('got data: ' + data);
      if (error) {
        console.log(error);
      }
    });
    console.log('were connected!');

    device.disconnect(function(error) {
      if (error) {
        return callback(error);
      }
      console.log("we got disconnected!!");
    });
    // Quit this program
    console.log("exit");
    process.exit(0);

  });


});




// batteryDev.discover(function(device) {
//   device.connectAndSetup(function(callback) {
//     var value = 0;
//     var toggleLED = function() {
//       value = (value == 0 ? 1 : 0);
//       console.log('toggle', value);
//       device.writeLedState(value, () => setTimeout(toggleLED, 1000));
//     };
//     toggleLED();
//   })
// });
