/* This is the Main script that prompts the user for the following:
*   - how many tests
    - restartCriteria:
        - humidity, temperature, co2
        note: must define restart threshold for at lest one process variable
*   - fill out each test please:
        Test #1
            - actuators:
                - H value
                - I value
                - E value
                - L value
                - C On/Off
            - number of read cycles:
        .
        .
        .
        Test #n
           - actuators:
                - H value
                - I value
                - E value
                - L value
                - C On/Off
            - number of read cycles:            
*/

/**
 * Once the user has entered the test configuration, start the test session
 * - run an actual session
 * - pass in a configuration with overrides for the actuators for each test
 * - note: setup the newSession to apply overrides to the environment manager controllers' output
 * - keep a count of the number of readings completed
 * - end the session when the required number of readings are completed for the current test
 * - note: the main test runner should pass an updated session_config to end the session
 * - move on to the next test and begin the pre-test stage, then start the test when that's done
 * - when all tests are completed end the session and give the report to the user
 */