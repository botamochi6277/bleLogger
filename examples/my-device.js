// Console colors
var black   = '\u001b[30m';
var red     = '\u001b[31m';
var green   = '\u001b[32m';
var yellow  = '\u001b[33m';
var blue    = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan    = '\u001b[36m';
var white   = '\u001b[37m';

var reset   = '\u001b[0m';

var async = require('async');

// create file
var fs = require('fs');
var moment = require('moment');
var filename = "./log/" + moment().format("YYYYMMDD-HHmmss") + ".txt";
var valuable = "tMac [ms]\t tCurie [ms]\t anaVal \n"
fs.writeFile(filename, valuable , function (err) {
  if (err) {
    console.log(err);
  }
});

// set up noble-device
var NobleDevice = require('../myindex');
var idOrLocalName = process.argv[2];

if (!idOrLocalName) {
  console.log(red + "node my-device.js [ID or local name]" + reset);
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
NobleDevice.Util.mixin(myDevice, NobleDevice.myService);

var tic = new Date();

myDevice.discover(function(device) {
  console.log('discovered: ' + device);

  device.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  device.on('batteryLevelChange', function(data) {
    console.log("batteryLevel: " + data);
  });
  device.on('clockChange', function(tVal) {
    // console.log("update clock: " + tVal);

    device.readAna0(function(error, val) {
      // console.log('\tAnalogValue0 = ' + val);
      // console.log(tVal + ": " + val);

      // write data on the text file
      var tac = new Date();
      var wdata = (tac -tic) + "\t" + tVal + "\t" + val + "\n";
      fs.appendFile(filename, wdata ,'utf8', function (err) {
        if (err) {
          console.log(err);
        }
      });

    });

  });

  device.connectAndSetUp(function(callback) {
    console.log('connectAndSetUp');

    device.readDeviceName(function(error, deviceName) {
      console.log('\tdevice name = ' + deviceName);
    });

    device.readBatteryLevel(function(error, batteryLevel) {
      console.log('\tInitial Battery Level = ' + batteryLevel);
    });
    device.readClock(function(error, clock) {
      console.log('\tInitial Time = ' + clock);
    });

    device.notifyBatteryLevel(function(counter) {
      console.log('notifyBatteryLevel');
    });
    device.notifyClock(function(counter) {
      console.log('notifyClock');
    });
  }); // end of connectAndSetUp
});
