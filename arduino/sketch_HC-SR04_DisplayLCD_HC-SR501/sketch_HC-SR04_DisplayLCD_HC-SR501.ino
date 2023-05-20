#include <LiquidCrystal.h>

LiquidCrystal lcd(1, 2, 4, 5, 6, 7); // Creates an LCD object. Parameters: (rs, enable, d4, d5, d6, d7)

const int trigPin = 9;
const int echoPin = 10;
const int pinPIR = 11;
bool valPIR = 0;
long duration;
int distanceCm;

void setup() {
  
lcd.begin(16,2); // Initializes the interface to the LCD screen, and specifies the dimensions (width and height) of the display
pinMode(trigPin, OUTPUT);
pinMode(echoPin, INPUT);
pinMode(pinPIR, INPUT);

}

void loop() {
  
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

duration = pulseIn(echoPin, HIGH);
distanceCm= duration*0.034/2;

valPIR = digitalRead(pinPIR);
delay(150);
lcd.clear();
lcd.setCursor(0,0); // Sets the location at which subsequent text written to the LCD will be displayed
lcd.print("Distanza: "); // Prints string "Distance" on the LCD
lcd.print(distanceCm); // Prints the distance value from the sensor
lcd.print("cm");
delay(10);
lcd.setCursor(0,1);
if(valPIR){
  lcd.print("Persona rilevata!!");
}
else{
  lcd.print("Non c'e' nessuno.");
}
delay(10);
}
