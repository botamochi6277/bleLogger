var MY_UUID                    = 'bf00';
var MY_CLOCK_UUID              = 'ca01';
var MY_ANALOG0_UUID            = 'ca02';
// The UUID must be small letters
function myService() {
}

// clock service (read,notify)
myService.prototype.readClock = function(callback) {
  this.readUInt32LECharacteristic(MY_UUID, MY_CLOCK_UUID, callback);
};

myService.prototype.onClockChange = function (data) {
  this.emit('clockChange', data.readUInt32LE(0));
};

myService.prototype.notifyClock = function (callback) {
  this.onClockChangeBinded       = this.onClockChange.bind(this);
  this.notifyCharacteristic(MY_UUID, MY_CLOCK_UUID, true, this.onClockChangeBinded, callback);
};

myService.prototype.unnotifyClock= function (callback) {
  this.notifyCharacteristic(MY_UUID, MY_CLOCK_UUID, false, this.onClockChangeBinded, callback);
};

// For Analog value
myService.prototype.readAna0 = function(callback) {
  this.readUInt16LECharacteristic(MY_UUID, MY_ANALOG0_UUID, callback);
};

myService.prototype.onAna0Change = function (data) {
  this.emit('clockChange', data.readUInt16LE(0));
};

myService.prototype.notifyAna0 = function (callback) {
  this.onAna0ChangeBinded       = this.onClockChange.bind(this);
  this.notifyCharacteristic(MY_UUID, MY_ANALOG0_UUID, true, this.onAna0ChangeBinded, callback);
};

myService.prototype.unnotifyAna0= function (callback) {
  this.notifyCharacteristic(MY_UUID, MY_ANALOG0_UUID, false, this.onAna0ChangeBinded, callback);
};

// Export my service
module.exports = myService;
