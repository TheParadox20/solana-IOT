#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>

const char* ssid     = "Happyhome";
const char* password = "JMongare@123";

HTTPClient http;
WiFiClient client;

void wifiSetup(){
  //start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

bool runHTTPclient(String payload){
  http.begin(client,"http://solana-iot.herokuapp.com/transact?station=1&amount=0.001&rfid="+payload);
  http.setTimeout(10000);
  int httpResponseCode = http.GET();
  String response = "{}"; 
  
  if (httpResponseCode>0) {
    digitalWrite(14,LOW);
    digitalWrite(13,HIGH);
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    response = http.getString();
  }
  else {
    digitalWrite(12,HIGH);
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    digitalWrite(12,LOW);
  }
  digitalWrite(13,LOW);
  digitalWrite(14,HIGH);
  // Free resources
  http.end();
  Serial.println(response);

  return true;
}