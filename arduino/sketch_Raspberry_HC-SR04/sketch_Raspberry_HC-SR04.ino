#include <Wire.h>
#define SLAVE_ADDRESS 0x2A

const int trigPin = 9;  // Pin del trigger del sensore
const int echoPin = 10; // Pin dell'echo del sensore
int distance;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Wire.begin(SLAVE_ADDRESS); // Inizializza il bus I2C
  Wire.onRequest(sendData); // Imposta la funzione di risposta alla richiesta del Raspberry Pi
}

void loop() {
  // Effettua una misura di distanza
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  distance = duration / 58; // Calcola la distanza in cm
  delay(500); // Attendere per 500 millisecondi prima di effettuare una nuova misura
}

void sendData() { 
    Wire.write(distance);  // Invia i dati al Raspberry Pi
}
