
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

var NobleDevice = require('../myindex');
// Add my service
// NobleDevice.MyService = require("../lib/my-service")

var TestDevice = function(peripheral) {
  NobleDevice.call(this, peripheral);
  this.localName = peripheral.advertisement.localName;
  this.serviceUuids = peripheral.advertisement.serviceUuids;
};

NobleDevice.Util.inherits(TestDevice, NobleDevice);
NobleDevice.Util.mixin(TestDevice, NobleDevice.DeviceInformationService);
NobleDevice.Util.mixin(TestDevice, NobleDevice.melosService);
NobleDevice.Util.mixin(TestDevice, NobleDevice.BatteryService);
NobleDevice.Util.mixin(TestDevice, NobleDevice.HeartRateMeasumentService);

console.log("Now Searching...");
TestDevice.discover(function(testDevice) {
  console.log(blue + 'found\t' + testDevice.id + reset);
  console.log(blue + 'name\t' + testDevice.localName + reset);

  if(testDevice.serviceUuids){
    console.log('serviceUuids\t' + testDevice.serviceUuids);
  }

  testDevice.on('disconnect', function() {
    process.exit(0);
  });

  async.series([
      function(callback) {
        console.log('connect');
        testDevice.connect(callback);
      },
      function(callback) {
        console.log('discoverServicesAndCharacteristics');
        testDevice.discoverServicesAndCharacteristics(callback);
      },
      function(callback) {
        console.log('readDeviceName');
        testDevice.readDeviceName(function(error, deviceName) {
          console.log('\tdevice name = ' + deviceName);
          callback();
        });
      },
      function(callback){
        console.log();
        testDevice.readClock(function(error, val) {
          console.log('\ttime = ' + val);
          callback();
        });
      },
      function(callback){
        console.log();
        testDevice.readBatteryLevel(function(error, val) {
          console.log('\tBattery Level = ' + val);
          callback();
        });
      },
      function(callback){
        console.log();
        testDevice.readMeasument(function(error, val) {
          console.log('\tHeartrate = ' + val);
          callback();
        });
      },
      function(callback) {
        console.log('disconnect');
        testDevice.disconnect(callback);
      }
    ]
  );

});
