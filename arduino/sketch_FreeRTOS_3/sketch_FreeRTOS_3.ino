#include <LiquidCrystal.h>
#include <Arduino_FreeRTOS.h>
#include <queue.h>
#include <Wire.h>
#include <ds3231.h>


// Dichiarazione dei pin per i componenti
LiquidCrystal lcd(2, 3, 4, 5, 6, 7);
const int trigPin = 9;
const int echoPin = 10;
const int pinPIR = 12;
const int ledPin = 13;

// Dichiarazione delle code per il sensore ultrasuoni e il sensore PIR
QueueHandle_t distanceQueue;
QueueHandle_t motionQueue;

// Variabili di stato per il display LCD
bool lcdActive = false;
bool lcdTimeout = false;
unsigned long lcdOffTime = 0;

// Dichiarazione variabili di stato per il LED
bool ledState = false;
bool ledMotionDetected = false;
unsigned long lastMotionTime = 0;

// Dichiarazione struttura per RTC
struct ts t; 

//////////////// Soglie per la distanza e il timeout ////////////////
int proxZone = 20;
int timeoutTime = 5000;
/////////////////////////////////////////////////////////////////////


void setup() {
  // Inizializzazione dei componenti
  lcd.begin(16, 2);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pinPIR, INPUT);
  pinMode(ledPin, OUTPUT);

  //Inizializzazione della trasmissione seriale
  Serial.begin(9600);

  //Inizializzazione della connessione con il RTC
  Wire.begin();
  DS3231_init(DS3231_CONTROL_INTCN);

  // Creazione delle code per la distanza (Ultrasuoni) e per il movimento (PIR)
  distanceQueue = xQueueCreate(1, sizeof(float));
  motionQueue = xQueueCreate(1, sizeof(bool));

  // Creazione del task per il monitoraggio del sensore ultrasuoni
  xTaskCreate(ultrasonicTask, "Ultrasonic Task", 128, NULL, 2, NULL);

  // Creazione del task per il monitoraggio del sensore PIR
  xTaskCreate(pirTask, "PIR Task", 128, NULL, 1, NULL);

  // Creazione del task per il controllo del display LCD e del LED
  xTaskCreate(lcd_led_ControlTask, "LCD Control Task", 128, NULL, 3, NULL);
}

void loop() {
  // Non esegue nulla nel loop principale
}

void ultrasonicTask(void *pvParameters) {
  float distance;
  for (;;) {
    // Misura la distanza utilizzando il sensore ultrasuoni
    distance = measureDistance();

    // Invia la distanza alla coda
    xQueueSend(distanceQueue, (void *)&distance, portMAX_DELAY);

    // Attende 100ms prima di effettuare una nuova misurazione
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

void pirTask(void *pvParameters) {
  bool motionDetected;
  for (;;) {
    // Legge lo stato del sensore PIR
    motionDetected = digitalRead(pinPIR) == HIGH;

    if (motionDetected){
      // Print sul monitor del rilevamento del movimento
      DS3231_get(&t);
      Serial.print("{\"topic\":\"movimento\",\"timestamp\":\"");
        Serial.print(t.year);
        Serial.print("-");
        Serial.print(t.mon);
        Serial.print("-");
        Serial.print(t.mday);
        Serial.print(" ");
        Serial.print(t.hour);
        Serial.print(":");
        Serial.print(t.min);
        Serial.print(":");
        Serial.print(t.sec);
        Serial.println("\",\"value\":\"rilevato\"}");
    }

    // Invia lo stato del movimento alla coda
    xQueueSend(motionQueue, (void *)&motionDetected, portMAX_DELAY);

    // Attende 100ms prima di effettuare una nuova lettura
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

void lcd_led_ControlTask(void *pvParameters) {
  float distance;
  bool motionDetected;
  for (;;) {
    // Controlla la coda del sensore ultrasuoni
    if (xQueueReceive(distanceQueue, &distance, portMAX_DELAY) == pdTRUE) {
      // Verifica se l'oggetto è nella zona di prossimità
      if (distance <= proxZone && !lcdActive) {
        lcdActive = true;
        lcdTimeout = false;
        lcd.display();
      }
      // Visualizza la distanza sul display se è attivo
      if (lcdActive) {
        lcd.setCursor(0, 0);
        lcd.print("                                ");
        lcd.setCursor(0, 0);
        lcd.print("Distance: ");
        lcd.print(distance, 0);
        lcd.print(" cm");

        vTaskDelay(250 / portTICK_PERIOD_MS);
      }

      // Controlla se la distanza è superiore a 20 cm per 5 secondi consecutivi
      if (distance > proxZone) {
        if (!lcdTimeout) {
          lcdTimeout = true;
          lcdOffTime = millis();
        } else if (millis() - lcdOffTime >= timeoutTime) {
          lcdActive = false;
          lcd.noDisplay();
        }
      } else {
        lcdTimeout = false;
      }
    }

    // Controlla la coda del sensore PIR
    if (xQueueReceive(motionQueue, &motionDetected, portMAX_DELAY) == pdTRUE) {
      // Verifica se è stato rilevato un movimento
      if (motionDetected && !ledMotionDetected) {
        ledMotionDetected = true;
        lastMotionTime = millis();
        digitalWrite(ledPin, HIGH);

        // Print sul monitor dell'accensione del led
        DS3231_get(&t);
        Serial.print("{\"topic\":\"led\",\"timestamp\":\"");
        Serial.print(t.year);
        Serial.print("-");
        Serial.print(t.mon);
        Serial.print("-");
        Serial.print(t.mday);
        Serial.print(" ");
        Serial.print(t.hour);
        Serial.print(":");
        Serial.print(t.min);
        Serial.print(":");
        Serial.print(t.sec);
        Serial.println("\",\"value\":\"acceso\"}");
      }
    }

    // Controlla lo stato del LED
    if (ledMotionDetected) {
      // Verifica se è trascorso il tempo di inattività
      if ((millis() - lastMotionTime >= timeoutTime) && (distance > proxZone) && (!motionDetected)) {
        ledMotionDetected = false;
        digitalWrite(ledPin, LOW);

        // Print sul monitor dello spegnimento del led
        DS3231_get(&t);
        Serial.print("{\"topic\":\"led\",\"timestamp\":\"");
        Serial.print(t.year);
        Serial.print("-");
        Serial.print(t.mon);
        Serial.print("-");
        Serial.print(t.mday);
        Serial.print(" ");
        Serial.print(t.hour);
        Serial.print(":");
        Serial.print(t.min);
        Serial.print(":");
        Serial.print(t.sec);
        Serial.println("\",\"value\":\"spento\"}");
      }
    }


    // Attende 100ms prima di effettuare un nuovo controllo
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

float measureDistance() {
  // Effettua la misurazione utilizzando il sensore ultrasuoni HC-SR04
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  unsigned long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2;
  return distance;
}