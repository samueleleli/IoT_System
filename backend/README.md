
# Server Backend

Applicazione server scritta in JavaScript utilizzando il framework Express.js. Questa applicazione fornisce un'API per gestire gli eventi registrati nel database offrendo funzionalità come la visualizzazione della lista degli eventi filtrata per topic, valore del topic e data/ora e l'accesso agli ultimi eventi.

L'applicazione definisce due rotte principali. La prima è una rotta POST ("http://localhost:3000/event") che accetta una richiesta per ottenere la lista degli eventi filtrati. Prima di elaborare la richiesta, vengono eseguiti alcuni middleware di validazione per controllare la correttezza dei parametri inviati. Se i parametri sono validi, si ottiente la lista degli eventi filtrati e viene inviata come risposta al client.

La seconda rotta è una rotta GET ("http://localhost:3000/lastEvents") che restituisce gli ultimi eventi registrati. Questa rotta non richiede alcun parametro.

L'app Express viene avviata in ascolto sulla **porta 3000**.

## Strumenti Utilizzati 

* [Visual Studio Code](https://code.visualstudio.com/): per lo sviluppo del codice
* [Postman](https://www.postman.com/): per effettuare il test delle rotte

## Librerie/Framework

* [Node.JS](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
* [Sequelize](https://sequelize.org/) 
* [Nodemon](https://nodemon.io/)
* [Express](http://expressjs.com/) 

## Configurazione e Avvio del server

1) Installazione librerie:
  ```bash
  cd ./backend
  npm install -g typescript​
  npm install -g sequelize
  npm install -g nodemon
  npm install
  ```
  2) Creare di un file chiamato ".env" con questa struttura
  (Inserire al suo interno i propri dati) 
  ```bash
  MYSQLUSER=
  MYSQLDB=
  MYSQLHOST=
  MYSQLPASSWORD=
  MYSQLPORT=
  ```

3) Compilazione file Typescript e Avvio del server

  ```bash
  tsc
  nodemon index.js
  ```



**_N.B. Bisogna avere un server mysql installato e attivo nella propria macchina_**

## Autori

- [Lisa Burini](https://github.com/lisaburini)
- [Anna Di Gaetano](https://github.com/Annadiga)
- [Matteo Ferretti](https://github.com/MatteoFerretti98)
- [Samuele Leli](https://github.com/samueleleli)
