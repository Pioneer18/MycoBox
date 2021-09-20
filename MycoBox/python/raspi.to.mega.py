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
finished = False
while finished == False:
    command = sys.argv[1] + '\n'
    ser.write(command.encode())
    line = ser.readline().decode('utf-8')
    if line != None: 
        print(line)
        finished = True
    if line == None or line == "":
        print("tee-hee no values for you")
    time.sleep(1)

