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
command = sys.argv[1] + '\n'
while finished == False:
    ser.write(command.encode())
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8')
        print(line)
        finished = True
    time.sleep(1)

