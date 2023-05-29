
# Progetto di Sistemi Operativi Dedicati - A.A. 2022/2023

L'obiettivo del progetto è stato quello di realizzare un applicativo IoT completo, ovvero, partendo dall'acquisizione dei dati  tramite sensori si è arrivati al loro salvataggio e, infine, alla loro visualizzazione.

Il progetto è composto da dei dispositivi, componenti e software da dover utilizzare obbligatoriamente e da dei requisiti da dover rispettare. Il tutto è riassumibile nella seguente tabella:
<p align="center">
  <img width="55%" height="55%" src="https://github.com/samueleleli/IoT_application/assets/45701240/97a623f8-8d48-4435-a6d9-0a14ec49aa9a">
</p>

La repository è composta da 5 directory:

- _**arduino**_ : contiene le versioni degli script realizzati per la board Arduino. Gli script realizzati utilizzano la libreria _**FreeRTOS**_
- _**backend**_ : contiene il backend dell'applicazione, ovvero la componente che permette di interagire con il database, il quale, ha al suo interno gli eventi rilevati da Arduino. Questa parte è stata realizzata tramite _**Node JS**_ e, in particolare, utilizzando le librerie _**Express**_ per la gestione delle rotte e _**Sequelize**_ per l'interfacciamento con il Database
- _**mqtt-client-angular**_ : contiene la parte front-end dell'applicazione. Essa è stata realizzata in _**Angular**_ perché è un framework che implementa al suo interno la programmazione reattiva e ad eventi. Difatti, Angular è stato utilizzato come un _**client MQTT**_ sottoscritto a tutti i topic. Tramite una sezione apposita, vengono mostrati, alla ricezione di nuovi eventi, i dati aggiornati. L'applicazione è costituita da un'altra sezione che utilizza il backend per recuperare i dati storici, permettendo il filtraggio per topic, valore del topic e data.
- _**mqtt-client-db**_ : contiene il client MQTT che è sottoscritto a tutti i topic e resta in attesa di nuovi eventi. Alla ricezione di eventi li aggiunge al database.
- _**raspberry**_: contiene al suo interno due script. Uno che permette di recuperare gli eventi inviati da Arduino tramite seriale e li pubblica sui topic. L'altro contiene lo script che permette di sincronizzare l'_**RTC**_.

Un'immagine semplificativa dei collegamenti tra i dispositivi è mostrata di seguito:
<p align="center">
    <img width="50%" height="50%" src="https://github.com/samueleleli/IoT_application/assets/57714440/bf883553-3480-4710-9389-9df6c29518f3">

</p>

## Installazioni necessarie nel pc Ubuntu

### Mosquitto: Broker MQTT
1) Installare Mosquitto
```bash
sudo apt install mosquitto mosquitto-clients -y
```

2) Modificare il file di configurazione

```bash
sudo nano /etc/mosquitto/mosquitto.conf
```
3) Copiare il contenuto accessibile da questo [link](https://github.com/samueleleli/IoT_application/blob/main/mqtt-client-db/mosquitto.conf) e incollarlo nell'editor appena aperto. Chiudere e salvare il file attraverso CTRL+O e poi CTRL+X

4) Caricare il file di configurazione appena modificato

```bash
sudo systemctl stop mosquitto
sudo mosquitto -c /etc/mosquitto/mosquitto.conf -v

(verificare il corretto avvio e premere CTRL+C per fermarlo)
```

5) Riavviare e abilitare l'avvio di mosquitto al boot del sistema operativo
```bash
sudo systemctl restart mosquitto
sudo systemctl enable mosquitto
``` 
6) Per verificare lo stato del servizio in qualsiasi momento
```bash
sudo systemctl status mosquitto
``` 
### Database MySQL: Salvataggio dei dati
   1) Installare MySQL Server
        ```bash
        sudo apt install mysql-server
        ``` 
   2) Installare Apache2
        ```bash
        sudo apt-get install apache2
        ``` 
   3) Verificare lo stato dei servizi
        ```bash
        sudo systemctl status mysql
        sudo systemctl status apache2
        ```
   4) Installare PHP
        ```bash
        sudo apt install php
        ```
   5) Installare PhpMyAdmin
        ```bash
        sudo apt install phpmyadmin
        nei menu che compaiono:
            -> apache2 (premere barra spaziatrice) e OK
            -> yes
            -> password: 123456
        ```
   6) Abilitare mbstring (per gestione stringhe in PHP) e riavviare apache2
        ```bash
        sudo phpenmod mbstring
        sudo systemctl restart apache2
        ```
   7) Creazione di un utente MySQL (root\_sod) con tutti i privilegi (password scelta: mysqlserver2023)
        ```bash
        # accesso tramite utente root
        sudo mysql -u root -p
            -> password: 12345678 (la stessa definita prima)
        # si entra nella shell mysql
        sql> CREATE USER 'root_sod'@'%' IDENTIFIED BY 'mysqlserver2023';
        sql> GRANT ALL PRIVILEGES ON '*.*' TO 'root_sod'@'%' WITH GRANT OPTION;
        sql> FLUSH PRIVILEGES;
        sql> EXIT;
        ```
   8) Accedere da browser all'indirizzo http://localhost/phpmyadmin/ con le credenziali dell'utente appena creato
    


## Autori

- [Lisa Burini](https://github.com/lisaburini)
- [Anna Di Gaetano](https://github.com/Annadiga)
- [Matteo Ferretti](https://github.com/MatteoFerretti98)
- [Samuele Leli](https://github.com/samueleleli)

