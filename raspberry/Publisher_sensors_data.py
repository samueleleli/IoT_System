#!/usr/bin/env python3
import paho.mqtt.client as mqtt #import the client1
import time
import serial
import json

list_topics = ["led","movimento","proxZone"]
possible_states = [["acceso","spento"],["rilevato","non rilevato"],["entrata","uscita"]]

client = mqtt.Client("raspberry-client") #create new instance
client.connect("sam.local") #connect to broker

serial_ok = False
while not serial_ok:
 try:
  ser = serial.Serial(
        port='/dev/ttyACM0',
        baudrate = 9600,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS,
        timeout=1
  )
  serial_ok = True
 except:
  print("error - Retrying...")
  serial_ok = False
  time.sleep(10)

print("Starting reading from serial line")

while 1:
  message=ser.readline()
  if len(message)>1:
   print(message)
   try:
    payload_dict = json.loads(message)
    topic = payload_dict["topic"]
    if topic in list_topics:
      index = list_topics.index(topic)
      value = payload_dict["value"]
      if value in possible_states[index]:
        data = "{\"value\":\""+payload_dict["value"]+"\",\"timestamp\":\""+payload_dict["timestamp"]+"\"}"
        client.publish(topic,data)
   except Exception as e:
    print(e)
    print("errors")
  client.loop(.1)

