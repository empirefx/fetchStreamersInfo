## Overview
Simple crawler for twitch, fetches `title` `avatar` `status` `thumbnails`.

### Installation

```bash
npm install

node index.js
```
### Usage
```javascript
import { default as handler } from './getStreamers.js';

// Set streamers to fetch in getStreamers.js
const request = handler();

request.then(function(result) {
   console.log(result);
   // Do whatever with response
   
});
```
### Libraries
[axios](https://github.com/axios/axios)
[cheerio](https://github.com/cheeriojs/cheerio)

### Disclaimer
Couldn't bother setting up two-factor authentication (2FA) for twitch api, needed fetch streamers data once in a while and keep working on that.
