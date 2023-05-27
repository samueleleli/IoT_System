import paho.mqtt.client as mqtt
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import json
import time

#Caricamento delle variabili d'ambiente
load_dotenv()

MYSQLUSER=  os.getenv('MYSQLUSER')
MYSQLDB=  os.getenv('MYSQLDB')
MYSQLHOST=  os.getenv('MYSQLHOST')
MYSQLPASSWORD=  os.getenv('MYSQLPASSWORD')
MYSQLPORT=  os.getenv('MYSQLPORT')


Base = declarative_base()
# classe per definire il modello della tabella Data, la quale contiene i dati del db
class Data(Base):
    __tablename__ = "Data"

    topic = Column(String, primary_key=True)
    timestamp = Column(TIMESTAMP, primary_key=True)
    value = Column(String)

# definizione della funzione di callback nel momento in cui arrivano nuovi messaggi
def on_message(client, userdata, message):
    print("Received message on topic:", message.topic)
    print("Message payload:", message.payload)

    payload_str = message.payload.decode('utf-8')   # conversione del payload del messaggio in una stringa
    payload_dict = json.loads(payload_str)          # parsing del payload in un json
    print(payload_dict)
    timestamp = payload_dict['timestamp']           # si prende il valore del timestamp
    value = payload_dict['value']                   # si prende il valore associato al topic
    try:
        # inzio transazione (DB)
        Session = sessionmaker()
        Session.configure(bind=engine)
        session = Session()
        data = Data(topic=message.topic,timestamp=timestamp,value=value)
        session.add(data)
        session.commit()
    except:
        print("Some problems occured on inserting data in db")


#configurazione db (DA ADATTARE AL PROPRIO username e password tramite il file .env)

connection_string = f"mysql+mysqlconnector://{MYSQLUSER}:{MYSQLPASSWORD}@{MYSQLHOST}:{MYSQLPORT}/{MYSQLDB}?auth_plugin=mysql_native_password"
connection_ok = False
while not connection_ok:
 try:
  engine = create_engine(connection_string, echo=True)

  # creazione del client
  client = mqtt.Client(client_id="client-db", clean_session=False)

  # setting della funzione di callback richiamata ogni volta che viene pubblicato un messaggio
  client.on_message = on_message

  # connessione al broker mqtt
  broker_address= "localhost"  # da cambiare con quello del pc in cui si trova il broker
  client.connect(broker_address) # connessione del client al broker
  connection_ok = True
 except:
  print("error - Retrying...")
  connection_ok = False
  time.sleep(10)


# sottoscrizione ai 3 topic
client.subscribe("led", qos=1)
client.subscribe("movimento", qos=1)
client.subscribe("proxZone", qos=1)

# inizio del loop mqtt
client.loop_forever()
