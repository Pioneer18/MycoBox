#Set the Filter Setting
import serial
import time
# Raspberry Pi Zero W has PL011 UART assigned to Bluetooth instead of GPIO default,
# follow these instructions for setup of UART port https://www.programmersought.com/article/93804026224/
ser = serial.Serial("/dev/ttyAMA0")
ser.write("A 32\r\n".encode())
ser.reset_input_buffer()
resp = ser.read(10)
print("Updated Filter Setting: ",resp)