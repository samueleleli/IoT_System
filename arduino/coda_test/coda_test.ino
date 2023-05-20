#include <Arduino_FreeRTOS.h>
#include <queue.h>

//dichiarazione coda
QueueHandle_t coda_dati;

//dichiarazione task
void sendDataTask(void *pvParameters);
void receiveDataTask(void *pvParameters);


void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);

  coda_dati = xQueueCreate(4,sizeof(int));
  if(coda_dati == NULL){
    Serial.println("ERRORE");
  }
  xTaskCreate(sendDataTask,"send",128,NULL,1,NULL);
  xTaskCreate(receiveDataTask,"receive",128,NULL,1,NULL);
  //vTaskSchedule();
}

void loop() {
  // put your main code here, to run repeatedly:

}

void sendDataTask(void *pvParameters){
  (void) pvParameters;
  int dato = 20;
  for (;;){
      xQueueSend(coda_dati,&dato,portMAX_DELAY);
      vTaskDelay(30000/portTICK_PERIOD_MS); // invia dato ogni 30 secondi    
  }
}

void receiveDataTask(void *pvParameters){
  (void) pvParameters;
  int valore = 0;
  for (;;){
    if(xQueueReceive(coda_dati,&valore,portMAX_DELAY) == pdPASS){
      Serial.println(valore);
    }
  }
}
