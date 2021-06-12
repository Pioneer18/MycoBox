const { PythonShell } = require("python-shell");


PythonShell.run('cozir.py', null, function (err, results) {
  if (err) throw err;
  console.log('Results: %j', results);
});