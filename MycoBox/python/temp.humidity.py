# Read The internal and External DHT22 sensors, 1 - 3, and report the results
from sys import modules
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_1 = 24  # bottom dht22
DHT_2 = 25  # mid dht22
DHT_3 = 1  # top dht22
DHT_4 = 12 # external dht22
sensor_list = [1,2,3]
h1 = 0
h2 = 0
h3 = 0
temp1 = 0
temp2 = 0
temp3 = 0
temp4 = 0

h1, temp1 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_1)
h2, temp2 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_2)
h3, temp3 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_3)
h4, temp4 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_4)

print('h1={', h1, '} h2={', h2, '} h3={', h3, '} h4={', h4, '} temp1={',
      temp1, '} temp2={', temp2, '} temp3={', temp3, '} temp4={', temp4, '}')
