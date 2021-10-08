const { PythonShell } = require('python-shell');

/**
 * DHT22 Temperature & humidity readings - internal & external
 * @param {Array} reply [h1,h2,h3,t1,t2,t3]
 */
 const mega_temp_humidity = () => {
     console.log(__dirname)
    let mega = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '../python',
        args: ["D 5"] // Read All Sensors
    };
    console.log("Mega: Args")
    return new Promise((resolve, reject) => {
        console.log(__dirname)
        PythonShell.run('raspi.to.mega.py', mega, function (err, reply) {
            if (err) reject(err)
            console.log('Should be reading mega data...')
            console.log(reply);
            resolve();
        })
    })
}

mega_temp_humidity()