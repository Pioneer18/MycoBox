import serial
import time
# Fresh Air Calibrate Cozir Sensor
ser = serial.Serial("/dev/ttyAMA0")
print ("Sending Calibrate Command\n")
ser.write("G\r\n".encode())
ser.reset_input_buffer()
resp = serial.read(10)
print("Sensor Response ",resp)