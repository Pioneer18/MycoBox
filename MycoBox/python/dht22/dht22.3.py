# Read DHT22.3, and report the results
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT = 1
humidity, temp = Adafruit_DHT.read_retry(DHT_SENSOR, DHT)
print({'temp': temp, 'humidity': humidity})