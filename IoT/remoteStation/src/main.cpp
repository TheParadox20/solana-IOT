#include <Arduino.h>
#include "rfid.h"

void setup() {
  Serial.begin(115200);
  setupRFID();
}

void loop() {
  scanCard();
}