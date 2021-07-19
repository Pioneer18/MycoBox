
# Can enable debug output by uncommenting:
#import logging
#logging.basicConfig(level=logging.DEBUG)

import Adafruit_MAX31855.MAX31855 as MAX31855
CLK = 11
CS  = 8
DO  = 9
def c_to_f(c):
        return c * 9.0 / 5.0 + 32.0
sensor = MAX31855.MAX31855(CLK, CS, DO)
temp = sensor.readTempC()
internal = sensor.readInternalC()
print('precise temp: {0:0.3F}*C / {1:0.3F}*F'.format(temp, c_to_f(temp)))
# print('Internal Temperature: {0:0.3F}*C / {1:0.3F}*F'.format(internal, c_to_f(internal)))

