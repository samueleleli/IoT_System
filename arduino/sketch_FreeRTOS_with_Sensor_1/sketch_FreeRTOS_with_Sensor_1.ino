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
bool valPIR = 0;
long duration;
int distanceCm;

QueueHandle_t lcdDistanceQueue;
QueueHandle_t lcdPIRQueue;

void taskDistance(void *pvParameters) {
  for (;;) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distanceCm = duration * 0.034 / 2;

    xQueueSend(lcdDistanceQueue, &distanceCm, portMAX_DELAY);
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

void taskPIR(void *pvParameters) {
  for (;;) {
    valPIR = digitalRead(pinPIR);
    vTaskDelay(pdMS_TO_TICKS(150));

    xQueueSend(lcdPIRQueue, &valPIR, portMAX_DELAY);
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

void taskLCD(void *pvParameters) {
  int distance;
  bool motionDetected;

  for (;;) {
    if (xQueueReceive(lcdDistanceQueue, &distance, portMAX_DELAY) == pdPASS) {
      lcd.setCursor(0, 0);
      lcd.print("                     ");
      lcd.setCursor(0, 0);
      lcd.print("Distanza: ");
      lcd.print(distance);
      lcd.print("cm");
      Serial.println(distance);


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

    if (xQueueReceive(lcdPIRQueue, &motionDetected, portMAX_DELAY) == pdPASS) {
      lcd.setCursor(0, 1);
      if (motionDetected) {
        lcd.print("Persona rilevata!");
      } else {
        lcd.print("Non c'e' nessuno.");
      }
      vTaskDelay(pdMS_TO_TICKS(10)); 
    }
  }
}



void setup() {
  lcd.begin(16, 2);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pinPIR, INPUT);

  lcdDistanceQueue = xQueueCreate(5, sizeof(int));
  lcdPIRQueue= xQueueCreate(5, sizeof(bool));
  xTaskCreate(taskDistance, "Distance", 128, NULL, 2, NULL);
  xTaskCreate(taskPIR, "PIR", 128, NULL, 1, NULL);
  xTaskCreate(taskLCD, "LCD", 256, NULL, 3, NULL);
  Serial.begin(9600);


  Wire.begin();
  DS3231_init(DS3231_CONTROL_INTCN);
}

void loop() {
}
