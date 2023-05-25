#!/usr/bin/env python3

#import librerie
import paho.mqtt.client as mqtt
import time
import serial
import json

# metodo utilizzato nel caso in cui il client si disconnette
def on_disconnect(client, userdata, rc):
    if rc != 0:
        client.reconnect()

# metodo per inizializzare la seriale
def inizializza_seriale():
  while True:
    for i in range(0,4):
      try:
        ser = serial.Serial(
              port='/dev/ttyACM'+str(i),
              baudrate = 9600,
              parity=serial.PARITY_NONE,
              stopbits=serial.STOPBITS_ONE,
              bytesize=serial.EIGHTBITS,
              timeout=1
        )
        return ser
      except:
        # se la porta /dev/ttyACM i-esima non è disponibile si aspettano 2 secondi e si riprova la connessione con un'altra
        print("ttyACM"+str(i)+" non rilevata")
        time.sleep(2)

list_topics = ["led","movimento","proxZone"]                              # topic ammessi
possible_states = [["acceso","spento"],["rilevato"],["entrata","uscita"]] # valori dei topic ammessi

ser = inizializza_seriale()               # inizializzazione seriale

client = mqtt.Client("raspberry-client")  # creazione del client
client.connect("sam.local")               # connessione del client al broker
client.on_disconnect = on_disconnect      # callback nel caso di disconnessione

print("Inizio lettura dalla seriale")

with ser:  # Utilizzo del blocco 'with' per gestire l'apertura e la chiusura della connessione seriale
  while True:
    try:
      message=ser.readline()  # lettura del messaggio
      if len(message)>1:
        print(message)
        try:
          payload_dict = json.loads(message)  # creazione dell'oggetto associato al json
          topic = payload_dict["topic"]       # lettura del topic
          if topic in list_topics:            # verifica della validità del topic
            index = list_topics.index(topic)  
            value = payload_dict["value"]
            if value in possible_states[index]: # verifica della validità del valore del topic
              # creazione del messaggio da pubblicare
              data = "{\"value\":\""+payload_dict["value"]+"\",\"timestamp\":\""+payload_dict["timestamp"]+"\"}"
              #publicazione del messaggio sul topic
              client.publish(topic,data)
        except json.JSONDecodeError as e:
          print("Json non valido")
    except serial.SerialException as e:
      # se la connessione con la seriale si interrompe si prova a rinizializzare la connessione
      print("Lettura sulla seriale interrotta..")
      print("Tentativo di riconnessione in corso")
      ser = inizializza_seriale()
    client.loop(.1)