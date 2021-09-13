#!/usr/bin/env python3
import serial
import time

ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
ser.flush()
while True:
    print('Sending Command: H 25')
    ser.write("H 25\n".encode())
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').rstrip()
        print(line)
    time.sleep(1)
    
