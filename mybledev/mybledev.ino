#include <CurieBLE.h>
/*
   This sketch example partially implements the standard Bluetooth Low-Energy Battery service.
   For more information: https://developer.bluetooth.org/gatt/services/Pages/ServicesHome.aspx
*/


/*  */
BLEPeripheral blePeripheral;       // BLE Peripheral Device (the board you're programming)

int oldBatteryLevel = 0;  // last battery level reading from analog input
unsigned long previousMillis = 0;  // last time the battery level was checked, in ms
unsigned long interval = 1; // ms

BLEService myService("bf00"); // BLE melos Service
BLEUnsignedLongCharacteristic clockULongChar("ca01", BLERead | BLENotify);
BLEUnsignedShortCharacteristic ana0UInt16Char("ca02", BLERead | BLENotify);

BLEService batteryService("180F"); // BLE Battery Service

// BLE Battery Level Characteristic"
BLEUnsignedCharCharacteristic batteryLevelChar("2A19",  // standard 16-bit characteristic UUID
    BLERead | BLENotify);     // remote clients will be able to

void setup() {
  Serial.begin(9600);    // initialize serial communication
  while (!Serial) {
    delay(1) ; // wait for serial port to connect. Needed for native USB port only
  }
  pinMode(13, OUTPUT);   // initialize the LED on pin 13 to indicate when a central is connected

  /* Set a local name for the BLE device
     This name will appear in advertising packets
     and can be used by remote devices to identify this BLE device
     The name can be changed but maybe be truncated based on space left in advertisement packet */
  char localName[] = "myBle"; // within 8charactors
  blePeripheral.setLocalName(localName);

  // Set my BLE services
  blePeripheral.setAdvertisedServiceUuid(myService.uuid());
  blePeripheral.addAttribute(myService);   // Add the BLE Clock service
  blePeripheral.addAttribute(clockULongChar); // add characteristic for clock value
  clockULongChar.setValue(0);   // initial value for clock value characteristic
  blePeripheral.addAttribute(ana0UInt16Char); // add characteristic of analog value at A0 pin
  ana0UInt16Char.setValue(0);

  blePeripheral.setAdvertisedServiceUuid(batteryService.uuid());  // add the service UUID
  blePeripheral.addAttribute(batteryService);   // Add the BLE Battery service
  blePeripheral.addAttribute(batteryLevelChar); // add the battery level characteristic
  batteryLevelChar.setValue(oldBatteryLevel);   // initial value for this characteristic

  /* Now activate the BLE device.  It will start continuously transmitting BLE
     advertising packets and will be visible to remote BLE central devices
     until it receives a new connection */
     
  blePeripheral.begin();
  Serial.print("Hello, I am \"");
  Serial.print(localName);
  Serial.println("\"");
  Serial.print("My birthday is ");
  Serial.print(__DATE__);
  Serial.print(", ");
  Serial.println(__TIME__);
  Serial.print("I am from ");
  Serial.println(__FILE__);
  Serial.println("Bluetooth device active, waiting for connections...");
  
}

void loop() {

  // listen for BLE peripherals to connect:
  BLECentral central = blePeripheral.central();
  
  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(13, HIGH);

    // check the battery level every [interval] ms
    // as long as the central is still connected:
    while (central.connected()) {
      unsigned long currentMillis = millis();
      // if interval[ms] have passed, check the battery level:
      if (currentMillis - previousMillis >= interval) {
        clockULongChar.setValue(currentMillis); // msec
        previousMillis = currentMillis;

        int battery = analogRead(A0);
        int batteryLevel = map(battery, 0, 1023, 0, 100);
        unsigned short anaVal0 = analogRead(A0); // may take 0.1 msec
        ana0UInt16Char.setValue(anaVal0);
        
        if (batteryLevel != oldBatteryLevel) {      // if the battery level has changed
          Serial.print("Battery Level % is now: "); // print it
          Serial.println(batteryLevel);
          batteryLevelChar.setValue(batteryLevel);  // and update the battery level characteristic
          oldBatteryLevel = batteryLevel;           // save the level for next comparison
        }
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(13, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}

