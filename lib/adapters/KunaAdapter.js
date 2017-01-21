var request = require('request');

var KunaAdapter = {
    name: 'Kuna',
    provides: [
        ['btc','steem'],
        ['btc','sbd'],
        ['btc','ltc'],
        ['golos', 'btc']
    ],
    get_pair: function(from,to,callback) {
        // Kuna calls it "gol" not "golos"
        if(from.toLowerCase() == 'golos') {
            from = 'gol';
        }
        var pair = [from.toLowerCase(),to.toLowerCase()].join(''),
            ticker_url = 'https://kuna.io/api/v2/tickers/'+pair;
        
        request(ticker_url, function(error,response,body) {
            if(error || response.statusCode != 200) {
                console.error('Invalid response code or server error:',error,response.statusCode);
                return callback(true,null);
            }
            var ticker_data = JSON.parse(body);
            if(!('last' in ticker_data['ticker'])) {
                console.error('Kuna returned an error %j', ticker_data);
                return callback(true,null);
            }
            return callback(false, ticker_data['ticker']['last']);

        });
    },
}

module.exports = KunaAdapter;