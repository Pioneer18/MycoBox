const {get} = require('../../globals/globals');

// given the overrides config object, for each actuator send the command value
const send_overrides = (ovrerides) => {
    // for each actuator send it's command
    get('overrides')
        .then(overrides => {
            console.log("Here Are the Overrides!!!!")
            console.log(overrides);
        })
}


module.exports = {
    send_overrides
}