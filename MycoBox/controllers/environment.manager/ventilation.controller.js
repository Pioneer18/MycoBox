/**
 * Ventilation Controller
 * ----------------------
 * This controller calculates a PID udpate value to be sent to the Mega controlled Dimmer for either intake, exhaust, or both
 * CO2 is the setpoint, the lower the CO2 the more air needs to be brought in and CO2 expelled out
 * Higher CO2 means not bringing much air in, maybe letting some CO2 out
 *  - use hard set dimmer thresholds, similar to ac threshold logic. 
 *  - Build CO2: no intake, exhaust only when peak reached and your'e maintaing. use low level...I guess could be dynamic between 1-450 🤔
 */
