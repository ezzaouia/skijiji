import request from 'request';
import cheerio from 'cheerio';
import async from 'async';

class Scraper {

  static scrapeAds(urls, callback) {
    let data = [];
    async.each(urls, function(url, next) {
      request('http://kijiji.ca' + url, (error, response, body) => {
        if(error) {
          return callback(error, false);
        }

        if(response.statusCode == 200) {
          let $ = cheerio.load(body), ad = {};

          ad.title = $('span[itemprop=name] h1').text().replace(/\n$/, '').trim();
          ad.attributes = {};

          $('.ad-attributes tr').each(function(i, tr) {
            if($(this).find('th').text() != '') {
              if($(this).find('th').text() == 'Address') {
                ad.attributes[$(this).find('th').text().replace(/\n$/, '').trim()] =
                  $(this).find('td').text().split('\n')[0].replace(/\n$/, '').trim();
              }
              else {
                ad.attributes[$(this).find('th').text().replace(/\n$/, '').trim()] =
                  $(this).find('td').text().replace(/\n$/, '').trim();
              }
            }
          });

          ad.description = $('span[itemprop=description]').text().replace(/(?:\\[rn]|[\r\n]+)+/g, '').trim();
          ad.phoneNumber = 'N/A';

          const numberPatt = /[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}/;
          if(ad.description.match(numberPatt)) {
            ad.phoneNumber = ad.description.match(numberPatt)[0];
          }

          ad.image = $('#ShownImage .showing img').attr('src');

          data.push(ad);
          return next();
        }
        else {
          next();
        }
      });
    },
    function(err) {
      if(err) {
        return callback(err, false);
      }

      return callback(null, data);
    });
  }

  static scrape(urls, callback) {
    let data = [];

    const self = this;
    async.each(urls, function(url, next) {
      request(url, (error, response, body) => {
        if(error) {
          return callback(error);
        }

        if(response.statusCode == 200) {
          let $ = cheerio.load(body), urls = [];

          $('.regular-ad').each(function(i, ad) {
            urls[i] = $(this).attr('data-vip-url');
          });

          self.scrapeAds(urls, (err, result) => {
            if(!err) {
              for(let r in result) {
                data.push(result[r]);
              }

              next();
            }
            else { next(); }
          });
        }
      });
    }
    , function(err, result) {
      if(err) {
        return callback(err, false);
      }

      return callback(null, data);
    });
  }

}

export default Scraper;
