
# Database service: Client mqtt

Il client mqtt ("Client_db.py") si occupa di connettersi a un broker MQTT, ascoltare i messaggi ricevuti e memorizzarli nel database MySQL. 

## Installazione librerie Python

Le librerie necessarie sono:

- *paho-mqtt*: per poter mettersi in ascolto sull'arrivo dei mesaggi dei topic​.

  Comando:
  ```bash
  sudo pip3 install paho-mqtt --target=/usr/lib/python3/dist-packages ​
  ```

- *python-dotenv*: per poter caricare il file di environment .env nello script.

  Comando:
  ```bash
  sudo pip3 install python-dotenv --target=/usr/lib/python3/dist-packages
  ```

- *mysql connector* e *sqlalchemy*: per la connessione al database 

  ```bash
  sudo pip3 install mysql-connector-python --target=/usr/lib/python3/dist-packages​

  sudo pip3 install sqlalchemy --target=/usr/lib/python3/dist-packages

  ```

## Configurazione e Avvio del client


1) Clonazione della repository

2) Copiare file "Client_db.py" nella cartella "/etc/init.d/" e dare permessi esecuzione:​


```bash
sudo cp ./Client_db.py  /etc/init.d && sudo chmod +x /etc/init.d/Client_db.py
```

3) Creazione del file di unità del servizio all'interno di "/etc/systemd/system", copiando al suo interno il contenuto del file "mqtt-client-db/service/publisher_sensors_data.service":​

```bash
sudo nano /etc/systemd/system/client_db.service
```

4) Creazione di un file chiamato ".env" con questa struttura
  (Inserire al suo interno i propri dati) 
  ```bash
  MYSQLUSER=
  MYSQLDB=
  MYSQLHOST=
  MYSQLPASSWORD=
  MYSQLPORT=
  ```
5) Spostare il file ".env" nella cartella "/etc/init.d"
  ```bash
  cp ./.env /etc/init.d
  ```

6) Controllo del servizio:
  - Avvio al boot:
    ```bash
    sudo systemctl enable client_db​
    ```
  - Start:
    ```bash
    sudo systemctl start client_db​
    ```
  - Stop:
    ```bash
    sudo systemctl stop client_db​
    ```
 - Status:
    ```bash
    sudo systemctl status client_db​
    ```
  - A ogni cambiamento dei file:
    ```bash
    systemctl daemon-reload ​
    sudo systemctl restart client_db    
    ```

**_N.B. Bisogna avere un server mysql installato e attivo nella propria macchina_**

## Autori

- [Lisa Burini](https://github.com/lisaburini)
- [Anna Di Gaetano](https://github.com/Annadiga)
- [Matteo Ferretti](https://github.com/MatteoFerretti98)
- [Samuele Leli](https://github.com/samueleleli)
