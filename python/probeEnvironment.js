
// Move into service 
const { PythonShell } = require("python-shell");
PythonShell.run('../python/CO2.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});

PythonShell.run('../python/tempAndHumidity.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});
