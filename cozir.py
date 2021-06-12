#Python progam to run a COZIR CO2 Sensor
import serial
import time
multiplier = 10 # 20% sensors requires a multiplier
# Raspberry Pi Zero W has PL011 UART assigned to Bluetooth instead of GPIO default,
# follow these instructions for setup of UART port https://www.programmersought.com/article/93804026224/
ser = serial.Serial("/dev/ttyAMA0")
print "Python progam to run a Cozir Sensor\n"
ser.write("M 4\r\n") # set display mode to show only CO2
ser.write("K 2\r\n") # set operating mode
# K sets the mode, 2 sets streaming instantaneous CO2 output
# \r\n is CR and LF
ser.flushInput()
time.sleep(1)
while True:
 ser.write("Z\r\n")
 resp = ser.read(10)
 resp = resp[:8]
 fltCo2 = float(resp[2:])
 print "CO2 PPM = ", fltCo2 * multiplier
 time.sleep(1) 
