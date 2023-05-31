#include <Arduino.h>
#include "rfid.h"
#include "http.h"

void setup() {
  Serial.begin(115200);
  pinMode(13,OUTPUT);//green
  pinMode(12,OUTPUT);//red
  pinMode(14,OUTPUT);//blue
  setupRFID();
  wifiSetup();
  digitalWrite(14,HIGH);
}

void loop() {
  scanCard();
}