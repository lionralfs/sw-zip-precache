import express from 'express';
import fs from 'fs';

const app = express();

// collect all .br files in `public` directory
const brotliFiles = new Set(walk('public', (f) => f.endsWith('.br')));

app.use((req, res, next) => {
  let asBrotli = 'public' + req.url + '.br';

  if (req.acceptsEncodings('br') !== false && brotliFiles.has(asBrotli)) {
    // set encoding to brotli
    res.setHeader('Content-Encoding', 'br');

    // since we're using `sendFile`, set the correct content-type manually
    let parts = req.url.split('.');
    let last = parts[parts.length - 1];
    res.contentType(last);

    res.sendFile(asBrotli, { root: '.' });
    return;
  }
  next();
});
app.use(express.static('public'));
app.listen(8080, () => console.log('server running...'));

/**
 * @see https://newbedev.com/node-js-fs-readdir-recursive-directory-search
 */
function walk(dir, filterFn) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file, filterFn));
    } else if (filterFn(file)) {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}
