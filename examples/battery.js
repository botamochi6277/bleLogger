var async = require('async');

var NobleDevice = require('../index');
// Add my service
var idOrLocalName = process.argv[2];

if (!idOrLocalName) {
  console.log("node battery.js [ID or local name]");
  process.exit(1);
}

var myDevice = function(device) {
  NobleDevice.call(this, device);
  this.localName = device.advertisement.localName;
};

myDevice.is = function(device) {
  var localName = device.advertisement.localName;
  return (device.id === idOrLocalName || localName === idOrLocalName);
};

NobleDevice.Util.inherits(myDevice, NobleDevice);
NobleDevice.Util.mixin(myDevice, NobleDevice.DeviceInformationService);
NobleDevice.Util.mixin(myDevice, NobleDevice.BatteryService);

myDevice.discover(function(device) {
  console.log('discovered: ' + device);

  device.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  device.on('batteryLevelChange', function(data) {
    console.log("batteryLevel: " + data);
  });

  device.connectAndSetUp(function(callback) {
    console.log('connectAndSetUp');

    device.readDeviceName(function(error, deviceName) {
      console.log('\tdevice name = ' + deviceName);
    });

    device.readBatteryLevel(function(error, batteryLevel) {
      console.log('\tInitial Battery Level = ' + batteryLevel);
    });

    device.notifyBatteryLevel(function(counter) {
      console.log('notifyBatteryLevel');
    });
  });
});
