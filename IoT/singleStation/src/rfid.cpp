#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>
#include "http.h"

#define SS_PIN 21
#define RST_PIN 22
 
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class

MFRC522::MIFARE_Key key; 

// Init array that will store new NUID 
byte nuidPICC[4];


/**
 * Function to return UID
 */
String getUID(byte *buffer, byte bufferSize) {
  String UID;
  for (byte i = 0; i < bufferSize; i++) { 
    UID+=buffer[i];
  }
  return UID;
}

void setupRFID() { 
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 
}
 
void scanCard() {

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been read
  if ( ! rfid.PICC_ReadCardSerial())
    return;

  if (rfid.uid.uidByte[0] != nuidPICC[0] || 
    rfid.uid.uidByte[1] != nuidPICC[1] || 
    rfid.uid.uidByte[2] != nuidPICC[2] || 
    rfid.uid.uidByte[3] != nuidPICC[3] ) {
    Serial.println(F("A new card has been detected."));

    // Store NUID into nuidPICC array
    for (byte i = 0; i < 4; i++) {
      nuidPICC[i] = rfid.uid.uidByte[i];
    }
   
    Serial.println(F("The NUID tag is:"));
    Serial.println(getUID(rfid.uid.uidByte, rfid.uid.size));
    Serial.println("");
    if(!runHTTPclient(getUID(rfid.uid.uidByte, rfid.uid.size))) rfid.uid.uidByte[0] = rfid.uid.uidByte[2];
  }
  else Serial.println(F("Card read previously."));

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();
}
