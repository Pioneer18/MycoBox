# Purpose: Set the MycoBox environment to the desired configuration
# Steps:
# 1. Sensor Module: Collect Environment Model
# call on each sensor module to retrieve the current 'Environment Model': The latest scan of the MycoBox
# Each sensor module should take readings over a 15-20 second period of time and return the average; async requests
# Create the Environment Model with the readings
# Compare the Environment Model with the passed in configuration, determine for each paramater if it must go up or down, and by how much
# This is called the 'EnvironmentUpdate"; 
# 2. Actuator Module: 









