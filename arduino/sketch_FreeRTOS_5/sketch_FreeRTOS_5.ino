#include <Arduino_FreeRTOS.h>
#include <LiquidCrystal.h>
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
int proxZone1 = 19;      // Soglia per l'entrata
int proxZone2 = 21;      // Soglia per l'uscita
int timeoutTime = 3000;  // Timeout per lo spegnimento
/////////////////////////////////////////////////////////////////////

void setup() {
  // Inizializzazione dei componenti
  lcd.begin(16, 2);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pinPIR, INPUT);
  pinMode(ledPin, OUTPUT);

  // Inizializzazione della trasmissione seriale
  Serial.begin(9600);

  // Inizializzazione della connessione con il RTC
  Wire.begin();
  DS3231_init(DS3231_CONTROL_INTCN);

  // Creazione delle code per la distanza (Ultrasuoni) e per il movimento (PIR)
  distanceQueue = xQueueCreate(1, sizeof(float));
  motionQueue = xQueueCreate(1, sizeof(bool));

  // Creazione del task per il monitoraggio del sensore ultrasuoni
  xTaskCreate(ultrasonicTask, "Ultrasonic Task", 128, NULL, 2, NULL);

  // Creazione del task per il monitoraggio del sensore PIR
  xTaskCreate(pirTask, "PIR Task", 128, NULL, 2, NULL);

  // Creazione del task per il controllo del display LCD e del LED
  xTaskCreate(lcd_led_ControlTask, "LCD Control Task", 128, NULL, 1, NULL);
}

void loop() {
  // Non esegue nulla nel loop principale
}

void ultrasonicTask(void *pvParameters) {
  float distance;
  TickType_t lastWakeTime = xTaskGetTickCount();
  const TickType_t measurementInterval = pdMS_TO_TICKS(100);

  while(true) {
    // Misura la distanza utilizzando il sensore ultrasuoni
    distance = measureDistance();

    // Invia la distanza alla coda
    xQueueSend(distanceQueue, (void *)&distance, 0);

    // Attende il prossimo intervallo di misurazione
    vTaskDelayUntil(&lastWakeTime, measurementInterval);
  }
}

void pirTask(void *pvParameters) {
  bool motionDetected;
  bool previousMotionDetected = false;
  unsigned long lastMotionTime = 0;
  const unsigned long motionInterval = 2000;  // Intervallo di tempo massimo tra i movimenti consecutivi (in millisecondi)
  TickType_t lastWakeTime = xTaskGetTickCount();
  const TickType_t readingInterval = pdMS_TO_TICKS(100);

  while(true) {
    // Legge lo stato del sensore PIR
    motionDetected = digitalRead(pinPIR) == HIGH;

    // Invia lo stato del movimento alla coda
    xQueueSend(motionQueue, (void *)&motionDetected, 0);

    // Verifica se è trascorso l'intervallo di tempo massimo tra i movimenti consecutivi
    if (motionDetected && previousMotionDetected && (millis() - lastMotionTime >= motionInterval)) {
      lastMotionTime = millis();
      // Print sul monitor del rilevamento del movimento
      printToSerial("movimento", "rilevato");
    }

    previousMotionDetected = motionDetected;

    // Attende il prossimo intervallo di lettura
    vTaskDelayUntil(&lastWakeTime, readingInterval);
  }
}

void lcd_led_ControlTask(void *pvParameters) {
  float distance;
  bool motionDetected;
  bool entered = false;
  bool exited = true;
  TickType_t lastWakeTime = xTaskGetTickCount();
  const TickType_t controlInterval = pdMS_TO_TICKS(100);
  const TickType_t displayInterval = pdMS_TO_TICKS(250);

  while(true) {
    // Controlla la coda del sensore ultrasuoni
    if (xQueueReceive(distanceQueue, &distance, 0) == pdTRUE) {
      // Verifica se l'oggetto è nella zona di prossimità
      if (distance <= proxZone2 && !lcdActive) {
        lcdActive = true;
        lcdTimeout = false;
        lcd.display();
      }

      // Verifica se l'oggetto è nella zona di prossimità per l'entrata
      if (distance < proxZone1 && !entered && exited) {
        entered = true;
        exited = false;

        // Print sul monitor del rilevamento del movimento
        printToSerial("proxZone", "entrata");
      }
      // Verifica se l'oggetto è nella zona di prossimità per l'uscita
      if (distance > proxZone2 && entered && !exited) {
        exited = true;
        entered = false;

        // Print sul monitor del rilevamento del movimento
        printToSerial("proxZone", "uscita");
      }

      // Visualizza la distanza sul display se è attivo
      if (lcdActive) {
        lcd.setCursor(0, 0);
        lcd.print("Distanza:                       ");
        lcd.setCursor(0, 0);
        lcd.print("Distanza: ");
        lcd.print(distance, 0);
        lcd.print(" cm");

        vTaskDelay(displayInterval);
      }

      // Controlla se la distanza è superiore a proxZone2 per x secondi consecutivi
      if (distance > proxZone2) {
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
    if (xQueueReceive(motionQueue, &motionDetected, 0) == pdTRUE) {
      // Verifica se è stato rilevato un movimento
      if (motionDetected && !ledMotionDetected) {
        ledMotionDetected = true;
        lastMotionTime = millis();
        digitalWrite(ledPin, HIGH);

        // Print sul monitor dell'accensione del led
        printToSerial("led", "acceso");
      }
    }

    // Controlla lo stato del LED
    if (ledMotionDetected) {
      // Verifica se è trascorso il tempo di inattività
      if ((millis() - lastMotionTime >= timeoutTime) && (distance > proxZone2) && (!motionDetected)) {
        ledMotionDetected = false;
        digitalWrite(ledPin, LOW);

        // Print sul monitor dello spegnimento del led
        printToSerial("led", "spento");
      }
    }

    // Attende il prossimo intervallo di controllo
    vTaskDelayUntil(&lastWakeTime, controlInterval);
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

void printToSerial(const char *actionValue, const char *stateValue) {
  DS3231_get(&t);
  Serial.print("{\"topic\":\"");
  Serial.print(actionValue);
  Serial.print("\",\"timestamp\":\"");
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
  Serial.print("\",\"value\":\"");
  Serial.print(stateValue);
  Serial.println("\"}");
}