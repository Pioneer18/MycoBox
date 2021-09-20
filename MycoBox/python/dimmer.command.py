#!/usr/bin/env python3
# This file needs to be generic and usable by any PID controller
# Parameters: Command
# How it works: Send command and...
import serial
import time
import sys
ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
ser.flush()
command = sys.argv[1] + '\n'
ser.write(command.encode())
print("Command Sent!")

