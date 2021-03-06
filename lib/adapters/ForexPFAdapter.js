var request = require('request');
var cheerio = require('cheerio');

var ForexPFAdapter = {
    name: 'ForexPF',
    provides: [
        ['xau','rur']
    ],
    symbols: {
        'xau': 'gold'
    },
    get_pair: function(from,to,callback) {
        // if(['usd', 'eur', 'gbp', 'rub'].indexOf(to) == -1) {
        //     // btc-e is backwards for altcoins, so flip the pair!
        //     var tmp = to;
        //     to = from;
        //     from = tmp;
        // }
        var ticker_url = 'http://www.forexpf.ru/chart/'+this.symbols[from]+'/';
        
        request(ticker_url, function(error,response,body) {
            if(error || response.statusCode != 200) {
                console.error(this.name, 'Invalid response code or server error:',error,response.statusCode);
                return callback(true,null);
            }
            var $ = cheerio.load(body);
            // body > table:nth-child(1) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td:nth-child(3) > table.stat > tbody > tr:nth-child(6) > td:nth-child(1) > font > font
            // note to self: chrome creates extraneous tbody's and font tags when using copy selector. 
            // original: body > table:nth-child(1) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td:nth-child(3) > table:nth-child(9) > tbody > tr:nth-child(4) > td:nth-child(1) > font > font
            // notice how tbody's were removed, as well as font tags
            var t_price = $('body > table:nth-child(1) > tr:nth-child(3) > td > table > tr:nth-child(2) > td:nth-child(3) > table:nth-child(9) > tr:nth-child(4) > td:nth-child(1)').text();
            console.log('Price is:', t_price);
            try {
                t_price = parseFloat(t_price.toString());
                if(isNaN(t_price)) {
                    throw "not a number";
                }
                // the price is for 1 gram, so / 1000 for mg
                t_price = t_price / 1000;
                console.log('ForexPF XAU/MG is:', t_price);
                callback(false, t_price);                
            } catch(e) {
                console.error('Price was NaN: ', t_price);
                callback(true,null);
            }
            // var ticker_data = JSON.parse(body);
            // if(!('ticker' in ticker_data) || !('last' in ticker_data['ticker'])) {
                // return callback(true,null);
            // }
            // return callback(false, ticker_data['ticker']['last']);

        }.bind(this));
    },
}

module.exports = ForexPFAdapter;
