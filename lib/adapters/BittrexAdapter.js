var request = require('request');

var BittrexAdapter = {
    name: 'Bittrex',
    provides: [
        ['btc','steem'],
        ['btc','sbd'],
        ['btc','ltc'],
        ['golos', 'btc']
    ],
    get_pair: function(from,to,callback) {
        // flip to fix
        if(from.toLowerCase() == 'golos' && to.toLowerCase() == 'btc') {
            from = 'btc'; to = 'golos';
        }
        var pair = [from.toLowerCase(),to.toLowerCase()].join('-'),
            ticker_url = 'https://bittrex.com/api/v1.1/public/getticker?market='+pair;
        
        request(ticker_url, function(error,response,body) {
            if(error || response.statusCode != 200) {
                console.error(this.name, 'Invalid response code or server error:',error,response.statusCode);
                return callback(true,null);
            }
            var ticker_data = JSON.parse(body);
            var success = ('success' in ticker_data) && ticker_data['success'] == true;
            if(!success || !('result' in ticker_data) || !('Last' in ticker_data['result'])) {
                console.error('Bittrex returned an error %j', ticker_data);
                return callback(true,null);
            }
            return callback(false, ticker_data['result']['Last']);

        });
    },
}

module.exports = BittrexAdapter;