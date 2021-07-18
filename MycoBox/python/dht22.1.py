# Read The internal and External DHT22 sensors, 1 - 3, and report the results
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT = 24
humidity, temp = Adafruit_DHT.read_retry(DHT_SENSOR, DHT)
print({'temp': temp, 'humidity': humidity})