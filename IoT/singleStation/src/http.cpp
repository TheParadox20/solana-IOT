#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>

const char* ssid     = "Happyhome";
const char* password = "JMongare@123";
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
  const int    HTTP_PORT   = 3000;
  const String HTTP_METHOD = "GET"; // or "POST"
  const char   HOST_NAME[] = "192.168.100.2"; // hostname of web server:
  const String PATH_NAME   = "";
  String queryString = "/transact?station=1&amount=0.001&rfid="+payload;
//   String queryString = "/test";

  WiFiClient client;
  if(client.connect(HOST_NAME, HTTP_PORT)) {
    Serial.println("Connected to server");
    digitalWrite(14,LOW);
    digitalWrite(13,HIGH);
    // send HTTP request header
    client.println("GET " + PATH_NAME + queryString + " HTTP/1.1");
    client.println("Host: " + String(HOST_NAME));
    client.println("Connection: close");
    client.println(); // end HTTP header
    //get client response
    String response = client.readString();
    // Serial.println(response);
    Serial.println("========================");
    Serial.println("Response:");
    Serial.println("========================");
    String identifier = "\r\n\r\n";
    String command;
    Serial.print("Found at: ");
    Serial.println(response.indexOf(identifier));
    if(response.indexOf(identifier)>0){
        //extract actual command
        int charIndex = response.indexOf(identifier)+identifier.length();
        while(response.charAt(charIndex)!='\n'){
            command+=response.charAt(charIndex);
            charIndex++;
        }
    }
    Serial.println(command);
    Serial.println("========================");
    client.stop();
    digitalWrite(13,LOW);
    if(command.indexOf("Failed")>=0){
        digitalWrite(12,HIGH);
        delay(2000);
        digitalWrite(12,LOW);
    }
    digitalWrite(14,HIGH);
    return true;
  } else {
    Serial.println("connection failed");
    return false;
  }
}