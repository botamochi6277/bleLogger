var NobleDevice = require('./lib/noble-device');

NobleDevice.Util = require('./lib/util');
NobleDevice.DeviceInformationService = require('./lib/device-information-service');
NobleDevice.BatteryService = require('./lib/battery-service');
NobleDevice.HeartRateMeasumentService = require('./lib/heart-rate-measument-service');
NobleDevice.myService = require('./lib/my-service');

module.exports = NobleDevice;
