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
    "h1": "95",
    "h2": "94",
    "h3": "53",
    "temp1": "25",
    "temp2": "25",
    "temp3": "27",
}
# Read the sensors and map the results dictionary
for x in sensor_list:
    if x == 1:
        # read the 1st sensor
        h1, temp_1 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_1)
        # map the dictionary
        results.update({"h1": h1})
        results.update({"temp1": temp_1})
    if x == 2:
        # read the 2nd sensor
        h2, temp_2 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_2)
        # map the dictionary
        results.update({"h2": h2})
        results.update({"temp2": temp_2})
    if x == 3:
        # read the 3rd sensor
        h3, temp_3 = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_3)
        # map the dictionary
        results.update({"h3": h3})
        results.update({"temp3": temp_3})
# Print the dictionary
print(results)

    # if h1 is not None and temp_1 is not None:
    #     print("Temp_1={0:0.1f}*C  Humidity_1={1:0.1f}%".format(temp_1, h1))
    # if h2 is not None and temp_2 is not None:
    #     print("Temp_2={0:0.1f}*C Humidity_2={1:0.1f}%")
    # if h3 is not None and temp_3 is not None:
    #     print("Temp_3={0:0.1f}*C Humidity_3={1:0.1f}%")
    # if h1 is not None and h2 is not None and h3 is not None:
    #     success = True
    # else:
    #     print("Failed to retrieve data from humidity sensor")
