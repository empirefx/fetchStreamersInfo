import { default as handler } from './getStreamers.js';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const request = handler();

request.then(function(result) {
   console.log(result);
   save(result);

   // Do whatever with response
});

// Save response in a file
function save(data) {
  fs.writeFileSync(
    path.join(__dirname, 'data', 'streamers.json'),
    JSON.stringify(data, null, 2)
  );
}