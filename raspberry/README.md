
# Raspberry: Client mqtt

Il dispositivo Raspberry Pi è stato utilizzato per:

- Mettersi in ascolto sulla seriale, in attesa di dati inviati da Arduino
- Quando arrivano nuovi dati deve pubblicarli sui 3 topic tramite protocollo MQTT:
    - Led: gli eventi che sono associati al Led 
        - acceso
        - spento
    - Movimento: gli eventi che sono associati al sensore a infrarossi
        - rilevato
        - non rilevato
    - proxZone: gli eventi che sono associati al sensore a ultrasuoni
        - entrata (nella zona di prossimità)
        - sucita (dalla zona di prossimità)
- Sincronizzare il modulo RTC collegato all'arduino


## Installazione librerie Python

Le librerie necessarie sono:

- *paho-mqtt*: per poter pubblicare gli eventi​.

  Comando:
  ```bash
  sudo pip3 install paho-mqtt --target=/usr/lib/python3/dist-packages ​
  ```
  

- *pyserial*: per poter ricevere i dati dalla seriale ​

  Comando
  ```bash
  sudo pip3 install pyserial --target=/usr/lib/python3/dist-packages
  ```


## Configurazione e Avvio del client

**Il Raspberry deve essere collegato ad Arduino tramite cavo USB.**

1) Clonazione della repository

2) Collegare il raspberry alla stessa rete locale tramite wi-fi o cavo ethernet e connettersi tramite ssh (inserire eventuali nome utente e password se richiesto).

```bash
ssh raspberrypi.local
```

3) Spostare contenuto dello script "Publisher_sensors_data.py" nella cartella "/etc/init.d/" del raspberry e dare permessi esecuzione:​


```bash
sudo chmod +x /etc/init.d/Publisher_sensors_data.py ​
```

4) Creazione del file di unità del servizio all'interno di "/etc/systemd/system", copiando al suo interno il contenuto del file "raspberry/service/publisher_sensors_data.service":​

```bash
sudo nano /etc/systemd/system/publisher_sensors_data.service
```

5) Controllo del servizio:
  - Avvio al boot:
    ```bash
    sudo systemctl enable publisher_sensors_data
    ```
  - Start:
    ```bash
    sudo systemctl start publisher_sensors_data
    ```
  - Stop:
    ```bash
    sudo systemctl stop publisher_sensors_data
    ```
 - Status:
    ```bash
    sudo systemctl status publisher_sensors_data
    ```
  - A ogni cambiamento dei file:
    ```bash
    systemctl daemon-reload ​
    sudo systemctl restart publisher_sensors_data    
    ```

## Sincronizzazione modulo RTC

**Il Raspberry deve essere collegato ad Arduino tramite cavo USB.**

1) Connettersi tramite ssh al Raspberry:
```bash
ssh raspberrypi.local
```
2) Copiare il contenuto del file "syncro_RTC.py" in un file con lo stesso nome. Avviare lo script tramite il comando:

```bash
python3 syncro_RTC.py
```
## Autori

- [Lisa Burini](https://github.com/lisaburini)
- [Anna Di Gaetano](https://github.com/Annadiga)
- [Matteo Ferretti](https://github.com/MatteoFerretti98)
- [Samuele Leli](https://github.com/samueleleli)
