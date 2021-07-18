# Read DHT22.1, and report the results
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT = 24
humidity, temp = Adafruit_DHT.read_retry(DHT_SENSOR, DHT)
print({'temp1': temp, 'humidity1': humidity})