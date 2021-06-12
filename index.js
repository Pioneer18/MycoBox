const { PythonShell } = require("python-shell");


PythonShell.run('script1.py', null, function (err) {
  if (err) throw err;
  console.log('finished');
});