
// Move into service 
const { PythonShell } = require("python-shell");
PythonShell.run('./CO2.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});

PythonShell.run('./tempAndHumidity.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});
