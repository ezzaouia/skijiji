# skijiji
A minimal Node.js module built on [Request](https://github.com/request/request) & [Cheerio](https://github.com/cheeriojs/cheerio) for scraping [Kijiji](http://www.kijiji.ca/) ads.

### Features
- Retrieve JSON objects of ads
- Retrieve up to n-pages of ads

### Installation
```
npm install skijiji --save
```

### Documentation
#### Skijiji(base_url)
The main Skijiji object.

##### Arguments
- ```base_url``` is the URL to be scraped. This URL must follow the format of "http://www.kijiji.ca/b-house-rental/ontario/c43l9004" where the only parameters that change are the category, location, and ID's.

#### Skijiji.scrape(pages, callback)

##### Arguments
- ```pages``` is the number of pages which will be scraped. Take note that this number will majorly effect response times of the function.
- ```callback(err, data)``` is the callback function where ```err``` and ```data``` are returned. You will find any errors within the ```err``` variable and upon a successful scrape, the resulting data will be included in ```data```.

### Example Usage
```javascript
var Skijiji = require('skijiji');
var skijiji = new Skijiji('http://www.kijiji.ca/b-house-rental/ontario/c43l9004');

skijiji.scrape(10, function(err, data) {
  if(err) {
    throw err;
  }
  
  console.log(results); // all ads excluding top ads
});
```

### To-do
- Abandon the URL usage to move to a more dynamic way of querying the ads
