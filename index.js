const { PythonShell } = require("python-shell");


PythonShell.run('python/readCO2.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});