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

# define the callback function for when a message is received
def on_message(client, userdata, message):
    print("Received message on topic:", message.topic)
    print("Message payload:", message.payload)

    # assume the message payload is stored in a variable called 'payload'
    payload_str = message.payload.decode('utf-8') # convert the payload bytes to a string
    payload_dict = json.loads(payload_str) # parse the payload string into a dictionary
    print(payload_dict)
    # access the value of the 'timestamp' key in the dictionary
    timestamp = payload_dict['timestamp']
    value = payload_dict['value']
    try:
        Session = sessionmaker()
        Session.configure(bind=engine)
        session = Session()
        data = Data(topic=message.topic,timestamp=timestamp,value=value)
        session.add(data)
        session.commit()
    except:
        print("Some problems occured on inserting data in db")


# Connection to database 
Base = declarative_base()

class Data(Base):
    __tablename__ = "Data"

    topic = Column(String, primary_key=True)
    timestamp = Column(TIMESTAMP, primary_key=True)
    value = Column(String)

#configurazione db (DA ADATTARE AL PROPRIO username e password

connection_string = f"mysql+mysqlconnector://{MYSQLUSER}:{MYSQLPASSWORD}@{MYSQLHOST}:{MYSQLPORT}/{MYSQLDB}?auth_plugin=mysql_native_password"
connection_ok = False
while not connection_ok:
 try:
  engine = create_engine(connection_string, echo=True)

  # client creation
  client_id = "db1"
  client =mqtt.Client(client_id) # creazione nuovo client (argomento: nome del client)

  # set the callback function
  client.on_message = on_message

  # connection to mqtt broker
  broker_address= "localhost"  # da cambiare con quello del pc in cui si trova il broker
  client.connect(broker_address) # connessione del client al broker
  connection_ok = True
 except:
  print("error - Retrying...")
  connection_ok = False
  time.sleep(10)


# subscribe to multiple topics
topic1 = "led"
topic2= "movimento"
topic3 = "prossimita"

client.subscribe(topic1, qos=0) # to unsubscribe: unsubscribe(topic)
client.subscribe(topic2, qos=0)
client.subscribe(topic3, qos=0)
client.subscribe([("topic1", 0), ("topic2", 0), ("topic3", 0)]) # QoS could be 0,1,2

# start the MQTT loop to listen for incoming messages
client.loop_forever()
