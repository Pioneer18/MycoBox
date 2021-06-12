const { PythonShell } = require("python-shell");


PythonShell.run('script1.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});