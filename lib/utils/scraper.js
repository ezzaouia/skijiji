var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

function Scraper() {
  // do nothing
}

Scraper.scrapeAds = function(urls, callback) {
  var data = [];

  async.each(urls, function(url, next) {
    if(url.indexOf('kijiji.ca') <= 0) {
      url = 'http://www.kijiji.ca' + url;
    }

    request(url, function(error, response, body) {
      if(error) {
        return callback(error, false);
      }

      var numberPatt = /[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}/;

      if(response.statusCode == 200) {
        var $ = cheerio.load(body), ad = {};

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

Scraper.scrape = function(urls, callback) {
  var data = [];

  var self = this;
  async.each(urls, function(url, next) {
    request(url, function(error, response, body) {
      if(error) {
        return callback(error, false);
      }

      if(response.statusCode == 200) {
        var $ = cheerio.load(body), urls = [];

        $('.regular-ad').each(function(i, ad) {
          urls[i] = $(this).attr('data-vip-url');
        });

        self.scrapeAds(urls, function(err, results) {
          if(err) {
            return next();
          }

          for(var result in results) {
            data.push(results[result]);
          }

          next();
        });
      }
    });
  },
  function(err, result) {
    if(err) {
      return callback(err, false);
    }

    callback(null, data);
  });
}

module.exports = Scraper;
