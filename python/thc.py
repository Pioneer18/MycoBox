#Python progam to run a COZIR CO2 Sensor
import serial
import time
# Raspberry Pi Zero W has PL011 UART assigned to Bluetooth instead of GPIO default,
# follow these instructions for setup of UART port https://www.programmersought.com/article/93804026224/
ser = serial.Serial("/dev/ttyAMA0")
print ("Display Mode: Temp, Humidity, CO2\n")
ser.write("M 4164\r\n".encode()) # set display mode to show all 3
ser.reset_input_buffer()
time.sleep(1)
while True:
    print("Requesting temperature reading")
    ser.write("T\r\n")
    resp = ser.read(10)
    print("10 bit Temp: ")
    #===========================================
    print('Requesting humidity reading')
    ser.write("H\r\n".encode())
    resp = ser.read(10)
    print("10 bit Humidity ", resp,"\n")
    #===========================================  
    print('Requesting CO2 reading')
    ser.write("Z\r\n".encode())
    resp = ser.read(10)
    print("10 bit CO2 ", resp,"\n")
    resp = resp[:8]
    print('8 bit CO2: ', resp,"\n")
    fltCo2 = float(resp[2:])
    print ("CO2 PPM = ", fltCo2)
    time.sleep(1) 
