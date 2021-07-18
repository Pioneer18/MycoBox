# Read The internal and External DHT22 sensors, 1 - 3, and report the results
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_1 = 24
DHT_2 = 25
DHT_3 = 1
success_1 = False
success_2 = False
success_3 = False
count = 0
while success_1 is False or success_2 is False or success_3 is False and count < 10:
    h1, temp_1 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_1)
    h2, temp_2 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_2)
    h3, temp_3 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_3)
    if h1 is not None and temp_1 is not None:
        print("Temp_1={0:0.1f}*C  Humidity_1={1:0.1f}%".format(temp_1, h1))
        success_1 = True
    if h2 is not None and temp_2 is not None:
        print("Temp_2={0:0.1f}*C Humidity_2={1:0.1f}%")
        success_2 = True
    if h3 is not None and temp_3 is not None:
        print("Temp_3={0:0.1f}*C Humidity_3={1:0.1f}%")
        success_3 = True
    if count < 10:
        count += 1
    else:
        print("Failed to retrieve data from humidity sensor")