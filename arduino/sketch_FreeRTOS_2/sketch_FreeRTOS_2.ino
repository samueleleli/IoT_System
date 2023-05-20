#include <LiquidCrystal.h>
#include <Arduino_FreeRTOS.h>
#include <queue.h>
#include <Wire.h>
#include <ds3231.h>

struct ts t; 

LiquidCrystal lcd(2, 3, 4, 5, 6, 7);
const int trigPin = 9;
const int echoPin = 10;
const int pinPIR = 12;
const int ledPin = 13;
bool valPIR = false;
long duration;
int distanceCm;

QueueHandle_t lcdDistanceQueue;

bool lcdActive = false;
int proxZone = 20;
int timeout = 5000;

TaskHandle_t lcdTaskHandle;
bool turnOffLCD = false;

void taskDistance(void *pvParameters) {
  for (;;) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distanceCm = duration * 0.034 / 2;

    if (distanceCm < proxZone && !lcdActive) {
      lcdActive = true;
      xQueueSend(lcdDistanceQueue, &distanceCm, portMAX_DELAY);
      turnOffLCD = false;  // Riavvia il timer di spegnimento
    } else if (distanceCm >= proxZone && lcdActive) {
      lcdActive = false;
      xQueueSend(lcdDistanceQueue, &distanceCm, portMAX_DELAY);
      turnOffLCD = true;  // Avvia il timer di spegnimento
    }
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

void taskPIR(void *pvParameters) {
  for (;;) {
    valPIR = digitalRead(pinPIR);
    if(valPIR){
      digitalWrite(ledPin, valPIR);  // Accende o spegne il LED in base a valPIR
    } else if (!valPIR && distanceCm > proxZone) {
      vTaskDelay(pdMS_TO_TICKS(timeout));  // Attendere 2 secondi
      digitalWrite(ledPin, LOW);  // Spegni il LED dopo il timeout
    }

    vTaskDelay(pdMS_TO_TICKS(150));

    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

void taskLCD(void *pvParameters) {
  int distance;
  bool motionDetected;

  for (;;) {
    if (xQueueReceive(lcdDistanceQueue, &distance, portMAX_DELAY) == pdPASS) {
      if (lcdActive){
        lcd.setCursor(0, 0);
        lcd.print("                     ");
        lcd.setCursor(0, 0);
        lcd.print("Distanza: ");
        lcd.print(distance);
        lcd.print("cm");
        Serial.println(distance);
      }
      else{
        lcd.clear();
      }

      DS3231_get(&t);
      Serial.print("Date : ");
      Serial.print(t.mday);
      Serial.print("/");
      Serial.print(t.mon);
      Serial.print("/");
      Serial.print(t.year);
      Serial.print("\t Hour : ");
      Serial.print(t.hour);
      Serial.print(":");
      Serial.print(t.min);
      Serial.print(".");
      Serial.println(t.sec);

      vTaskDelay(pdMS_TO_TICKS(10));
    }

    if (turnOffLCD) {
      vTaskDelay(pdMS_TO_TICKS(timeout));  // Attendere 2 secondi
      lcd.clear();
      turnOffLCD = false;  // Resetta la variabile di controllo
    }
  }
}

void setup() {
  lcd.begin(16, 2);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pinPIR, INPUT);
  pinMode(ledPin, OUTPUT);  // Imposta il pin del LED come output

  lcdDistanceQueue = xQueueCreate(5, sizeof(int));
  xTaskCreate(taskDistance, "Distance", 128, NULL, 2, NULL);
  xTaskCreate(taskPIR, "PIR", 128, NULL, 1, NULL);
  xTaskCreate(taskLCD, "LCD", 256, NULL, 3, NULL);
  Serial.begin(9600);


  Wire.begin();
  DS3231_init(DS3231_CONTROL_INTCN);
}

void loop() {
}