#!/usr/bin/env python3
import serial
import time

# ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
# ser.flush()
# while True:
#     if ser.in_waiting > 0:
#         line = ser.readline().decode('utf-8').rstrip()
#         print(line)
ser = serial.Serial('/dev/ttyACM0', 115200)
while True:
    ser.write("H 25\r\n".encode())
    time.sleep(2)
    line = ser.readline().decode('utf-8').rstrip()
    print(line)