# Read The internal and External DHT22 sensors, 1 - 3, and report the results
from sys import modules
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_1 = 24  # lower dht22
DHT_2 = 25  # top dht22
DHT_3 = 1  # external dht22
sensor_list = [1, 2]
h1 = 0
h2 = 0
h3 = 0
temp1 = 0
temp2 = 0
temp3 = 0
for x in sensor_list:
    if x == 1:
        h1, temp1 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_1)
        continue
    if x == 2:
        h2, temp2 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_2)
        continue
    if x == 3:
        h3, temp_3 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_3)
        continue
file = '/RootCulture/MycoBox/test.txt'
update = open(file, 'w')
update.write(h1)
print('h1={', h1, '} h2={', h2, '} h3={', h3, '} temp1={',
      temp1, '} temp2={', temp2, '} temp3={', temp3, '}')
