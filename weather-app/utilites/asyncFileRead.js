const fs = require('fs');
module.exports = (path) => {
  return new Promise((res, rej) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        rej('Файл не обнаружен');
      }
      res(data);
    })
  });
}