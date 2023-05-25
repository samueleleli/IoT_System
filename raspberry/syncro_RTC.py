# import librerie
import serial
import time
from datetime import datetime

serial_ok = False
# inizializzazione seriale
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

# si prende la data e l'ora in questo momento
now = datetime.now()

print(now.year, now.month, now.day, now.hour, now.minute, now.second)
# si costruisce la stringa da inviare sulla seriale
dt_string = "hour="+str(now.hour).zfill(2)+", min="+str(now.minute).zfill(2)+", sec="+str(now.second).zfill(2)+", mday="+str(now.day).zfill(2)+", mon="+str(now.month).zfill(2)+", year="+str(now.year)+" \n"
print(dt_string)
# si scrive la stringa sulla seriale
ser.write(dt_string)

