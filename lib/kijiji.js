import scraper from './utils/scraper';

class Kijiji {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.url = baseUrl;
    this.catLoc = baseUrl.split('/')[5];
    this.page = 1;

    if(this.url.indexOf('/page-') > 0) {
      throw new Error('A base URL must not include a page number.');
    }
  }

  getNextPages(depth, callback) {
    if(depth == 1) {
      return callback([ this.url ]);
    }

    let preUrl = 'http://www.kijiji.ca', urlSplit = this.baseUrl.split('/'), urls = [];

    preUrl += '/' + urlSplit[3] + '/' + urlSplit[4];
    let postUrl = this.catLoc;

    urls.push(this.url);

    for(let i = this.page; i < depth; i++) {
      urls.push(preUrl + '/page-' + i + '/' + postUrl);
    }

    return callback(urls);
  }

  changePage(page) {
    this.page = page;
    let newUrl = 'http://kijiji.ca', urlSplit = this.baseUrl.split('/');

    newUrl += '/' + urlSplit[1] + '/' + urlSplit[2];
    newUrl += '/page-' + this.page + '/' + this.catLoc;

    this.url = newUrl;
  }

  scrape(pages, callback) {
    this.getNextPages(pages, (urls) => {
      scraper.scrape(urls, (err, results) => {
        if(err) {
          return callback(err, false);
        }

        return callback(null, results);
      });
    });
  }

}

export default Kijiji;
