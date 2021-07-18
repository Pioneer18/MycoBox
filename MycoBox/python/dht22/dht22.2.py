# Read DHT22.2, and report the results
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT = 25
humidity, temp = Adafruit_DHT.read_retry(DHT_SENSOR, DHT)
print({'temp2': temp, 'humidity2': humidity})