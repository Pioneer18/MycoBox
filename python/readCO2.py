#Python progam to run a COZIR CO2 Sensor
import serial
import time
# Raspberry Pi Zero W has PL011 UART assigned to Bluetooth instead of GPIO default,
# follow these instructions for setup of UART port https://www.programmersought.com/article/93804026224/
ser = serial.Serial("/dev/ttyAMA0")
print ("Display Mode: CO2\n")
ser.write("M 4\r\n".encode()) # set display mode to show only C02
ser.write("K 2\r\n") # set operating mode to polling
ser.reset_input_buffer()
time.sleep(1)
print('Requesting CO2 reading')
ser.write("Z\r\n".encode())
ser.reset_input_buffer()
resp = ser.read(10)
resp = resp[:8]
fltCo2 = float(resp[2:])
print ("CO2 PPM = ", fltCo2) 

