import serial
import time
from datetime import datetime

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

# datetime object containing current date and time
now = datetime.now()

print(now.year, now.month, now.day, now.hour, now.minute, now.second)
dt_string = "hour="+str(now.hour).zfill(2)+", min="+str(now.minute).zfill(2)+", sec="+str(now.second).zfill(2)+", mday="+str(now.day).zfill(2)+", mon="+str(now.month).zfill(2)+", year="+str(now.year)+" \n"
print(dt_string)
ser.write(dt_string)

