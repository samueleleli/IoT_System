
## Scripts Arduino

Script Arduino utilizzati per gestire e coordinare le attività dei sensori. Lo script fa uso della libreria [FreeRTOS](https://www.freertos.org/).

Il dispositivo Arduino UNO è stato utilizzato per:

- Leggere i dati dal sensore a Infrarossi PIR HC-SR501
- Leggere i dati dal sensore a Ultrasuoni HC-SR04
- Inviare messaggi a Raspberry quando si verificano determinati eventi:
	- Oggetto entra nella zona di prossimità
	- Oggetto esce dalla zona di prossimità
	- Movimento rilevato
	- LED acceso
	- LED spento
- Sincronizzare il modulo RTC con i dati ricevuti da Raspberry Pi 3

## Installazione librerie Arduino

Le librerie necessarie per la compilazione degli script sono:
- FreeRTOS by Richard Barry
- LiquidCrystal by Arduino
- DS3231 by Andrew Wickert
- Adafruit BusIO by Adafruit

L'installazione di tali librerie può essere effettuato direttamente dall'IDE proprietario di Arduino che ha una sezione apposita dove possono essere cercate per nome e installate con un semplice click.


## Set Porta e Device

Prima di eseguire i programmi Arduino è necessario controllare che il device utilizzato sia riconosciuto dal PC, nel caso non lo fosse è necessario aggiornare i driver o in modo automatico dal pannello di controllo oppure scaricandoli dal [sito di Arduino](https://docs.arduino.cc/tutorials/generic/DriverInstallation).

Una volta installati i driver sarà necessario selezionare la porta COM a cui è collegata la board:
<p align="center">
    <img width="50%" height="50%" src="https://github.com/samueleleli/IoT_application/blob/main/arduino/Arduino_1.png">

</p> 
E il device utilizzato:
<p align="center">
    <img width="50%" height="50%" src="https://github.com/samueleleli/IoT_application/blob/main/arduino/Arduino_2.png">

</p> 


## Sincronizzazione Modulo RTC

Per la sincronizzazione del modulo RTC per il timestamp è necessario eseguire il programma "set_DateTime_RTC.ino".

## Esecuzione programma per elaborazione dati da sensori

Per l'elaborazione dati, è necessario eseguire, dopo il programma di sincronizzazione del modulo RTC, il programma "sketch_FreeRTOS_5.ino".


## Autori

- [Lisa Burini](https://github.com/lisaburini)
- [Anna Di Gaetano](https://github.com/Annadiga)
- [Matteo Ferretti](https://github.com/MatteoFerretti98)
- [Samuele Leli](https://github.com/samueleleli)
