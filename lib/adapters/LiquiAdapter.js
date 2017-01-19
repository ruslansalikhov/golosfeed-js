var request = require('request');

var LiquiAdapter = {
    name: 'Liqui',
    provides: [
        ['golos', 'btc']
    ],
    get_pair: function(from,to,callback) {
        // console.log(from,to);

        var pair = [from.toLowerCase(),to.toLowerCase()].join('_'),
            ticker_url = 'https://api.liqui.io/api/3/ticker/' + pair;
        
        request(ticker_url, function(error,response,body) {
            if(error || response.statusCode != 200) {
                console.error('Invalid response code or server error:',error,response.statusCode);
                return callback(true,null);
            }
            var ticker_data = JSON.parse(body);
            if(!('last' in ticker_data[pair])) {
                return callback(true,null);
            }
            return callback(false, ticker_data[pair]['last']);

        });
    }
}

module.exports = LiquiAdapter;
