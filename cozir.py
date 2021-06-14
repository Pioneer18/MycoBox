#Python progam to run a COZIR CO2 Sensor
import serial
import time
# Raspberry Pi Zero W has PL011 UART assigned to Bluetooth instead of GPIO default,
# follow these instructions for setup of UART port https://www.programmersought.com/article/93804026224/
ser = serial.Serial("/dev/ttyAMA0")
print ("Python progam to run a Cozir Sensor\n")
ser.write("M 4\r\n".encode()) # set display mode to show only CO2
ser.write("K 2\r\n".encode()) # set operating mode
# K sets the mode, 2 sets streaming instantaneous CO2 output
# \r\n is CR and LF
print('wrote to the sensor')
ser.reset_input_buffer()
print('pause program while transmit buffer is flushed')
time.sleep(1)
while True:
 print('inside the while loop')
 ser.write("Z\r\n".encode())
 print('Requesting CO2 reading')
 resp = ser.read(10)
 print(resp)
 print('read from the sensor')
 resp = resp[:8]
 print('8 bits or response: ', resp)
 fltCo2 = float(resp[2:])
 print ("CO2 PPM = ", fltCo2)
 time.sleep(1) 
