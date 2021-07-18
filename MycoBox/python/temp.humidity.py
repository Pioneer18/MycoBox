# Read The internal and External DHT22 sensors, 1 - 3, and report the results
import Adafruit_DHT
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_1 = 24  # lower dht22
DHT_2 = 25  # top dht22
DHT_3 = 1  # external dht22
success = False
count = 0
sensor_list = [1, 2, 3]
results = {
    "h1": 0,
    "h2": 0,
    "h3": 0,
    "temp1": 0,
    "temp2": 0,
    "temp3": 0,
}
for x in sensor_list:
    if x == 1:
        h1, temp_1 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_1)
        print("Humidity_1={0:0.1f}%".format(h1))
        print("Temp_1={0:0.1f}*C".format(temp_1))
        results.update({"h1": h1})
        results.update({"temp1": temp_1})
    if x == 2:
        h2, temp_2 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_2)
        print("Humidity_1={0:0.1f}%".format(h2))
        print("Temp_1={0:0.1f}*C".format(temp_2))
        results.update({"h2": h2})
        results.update({"temp2": temp_2})
    if x == 3:
        h3, temp_3 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_3)
        print("Humidity_1={0:0.1f}%".format(h3))
        print("Temp_1={0:0.1f}*C".format(temp_3))
        results.update({"h3": h3})
        results.update({"temp3": temp_3})
print(results)

