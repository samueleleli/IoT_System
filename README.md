
# Progetto di Sistemi Operativi Dedicati - A.A. 2022/2023

L'obiettivo del progetto è stato quello di realizzare un applicativo IoT completo, ovvero, partendo dall'acquisizione dei dati  tramite sensori si è arrivati al loro salvataggio e, infine, alla loro visualizzazione.

Il progetto è composta da dei dispositivi, componenti e software da dover utilizzare obbligatoriamente e da dei requisiti da dover rispettare. Il tutto è riassumibile nella seguente tabella:
<p align="center">
  <img width="55%" height="55%" src="https://github.com/samueleleli/IoT_application/assets/45701240/97a623f8-8d48-4435-a6d9-0a14ec49aa9a">
</p>

La repository è composta da 5 directory:

- _**arduino**_ : contiene le versioni degli script realizzati per la board Arduino. Gli script realizzati utilizzano la libreria _**FreeRTOS**_
- _**backend**_ : contiene il backend dell'applicazione, ovvero la componente che permette di interagire con il database, il quale, ha al suo interno gli eventi rilevati da Arduino. Questa parte è stata realizzata tramite _**Node JS**_ e, in particolare, utilizzando le librerie _**Express**_ per la gestione delle rotte e _**Sequelize**_ per l'interfacciamento con il Database
- _**mqtt-client-angular**_ : contiene la parte front-end dell'applicazione. Essa è stata realizzata in _**Angular**_ perchè è un framework che implementa al suo interno la programmazione reattiva e ad eventi. Difatti, Angular è stato utilizzato come un _**client MQTT**_ sottoscritto a tutti i topic. Tramite una sezione apposita, vengono mostrati, alla ricezione di nuovi eventi, i dati aggiornati. L'applicazione è costituita da un'altra sezione che utilizza il backend per recuperare i dati storici, permettendo il filtraggio per topic, valore del topic e data.
- _**mqtt-client-db**_ : contiene il client MQTT che è sottoscritto a tutti i topic e resta in attesa di nuovi eventi. Alla ricezione di eventi li aggiunge al database.
- _**raspberry**_: contiene al suo interno due script. Uno che permette di recuperare gli eventi inviati da Arduino tramite seriale e li pubblica sui topic. L'altro contiene lo script che permette di sincronizzare l'_**RTC**_.

Un'immagine semplificativa dei collegamenti tra i dispositivi è mostrata di seguito:
<p align="center">
  [//]: <> (<img width="50%" height="50%" src="https://github.com/samueleleli/IoT_application/assets/45701240/4d035aaf-cd8d-40a5-b7fc-aa69e71a5b94">)
    <img width="50%" height="50%" src="https://github.com/samueleleli/IoT_application/assets/57714440/bf883553-3480-4710-9389-9df6c29518f3">

</p>

## Autori

- [Lisa Burini](https://github.com/lisaburini)
- [Anna Di Gaetano](https://github.com/Annadiga)
- [Matteo Ferretti](https://github.com/MatteoFerretti98)
- [Samuele Leli](https://github.com/samueleleli)

