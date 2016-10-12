var Scraper = require('./utils/scraper');

function Kijiji(baseUrl) {
  this.baseUrl = baseUrl;
  this.url = baseUrl;
  this.catLoc = baseUrl.split('/')[5];
  this.page = 1;

  if(this.url.indexOf('/page-') > 0) {
    throw new Error('A base URL must not include a page number.');
  }
}

Kijiji.prototype = {
  constructor: Kijiji,
  getNextPages: function(depth, callback) {
    if(depth == 1) {
      return callback([ this.url ]);
    }

    var preUrl = 'http://www.kijiji.ca',
        urlSplit = this.baseUrl.split('/'),
        postUrl = this.catLoc,
        urls = [];

    preUrl += '/' + urlSplit[3] + '/' + urlSplit[4];

    urls.push(this.url);

    for(var i = this.page; i < depth; i++) {
      urls.push(preUrl + '/page-' + i + '/' + postUrl);
    }

    return callback(urls);
  },
  scrape(pages, callback) {
    this.getNextPages(pages, function(urls) {
      Scraper.scrape(urls, function(err, results) {
        if(err) {
          return callback(err, false);
        }

        return callback(null, results);
      });
    });
  }
}

module.exports = Kijiji;
