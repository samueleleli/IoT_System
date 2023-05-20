#include <Ultrasonic.h>

Ultrasonic ultrasonic(12, 13); //(trig, echo)

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.print("Distance in cm: ");
  Serial.println(ultrasonic.distanceRead());
  delay(1000);
  delay(2000);
}