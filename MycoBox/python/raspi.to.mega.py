#!/usr/bin/env python3
# This file needs to be generic and usable by any PID controller
# Parameters: Command
# How it works: Send command and report if it was successfully initiated by Arduino
# The Arduino will notify an error or confirmation
import serial
import time
import sys
ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
ser.flush()
finshed = False
# print('Number of Arguments: ', len(sys.argv), 'arguments.')
# print('Argument List: ', str(sys.argv)) # stdout print the argument(s)
ser.write("H 300\r\n".encode())
while finshed == False:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8')
        print(line)
        finshed = True
    time.sleep(1)
    print('makin bacon pancakes')
# ser.readline().decode('utf-8').rstrip()
