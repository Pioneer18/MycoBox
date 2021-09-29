// Primary Objective:
// When entered into CO2 mode, calculate a CO for getting the CO2 level to what it needs to be
    // based on FOPDT model of exhausting CO2 and checking at dt with CO2 meter
// Respond to flag requests from the humidity / temperature controllers to reduce or increase ventilation
// (turn on to hardcoded levels if that's the config: user just wants that, or not growing mushrooms)

// Note: Don't think a real PID is necessary, just reduce by levels to give the humidifier enough time
// increase the humidity. Or increase levels to drop humidity enough; slowly