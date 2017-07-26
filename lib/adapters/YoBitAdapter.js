var request = require('request');

var YoBitAdapter = {
    name: 'YoBit',
    provides: [
        ['btc','rur']
    ],
    get_pair: function(from,to,callback) {
        console.log(from,to);

        var pair = [from,to].join('_'),
            ticker_url = 'https://yobit.net/api/2/'+pair+'/ticker';
        
        request(ticker_url, function(error,response,body) {
            if(error || response.statusCode != 200) {
                console.error(this.name, 'Invalid response code or server error:',error,response.statusCode);
                return callback(true,null);
            }
            var ticker_data = JSON.parse(body);
            if(!('ticker' in ticker_data) || !('last' in ticker_data['ticker'])) {
                return callback(true,null);
            }
            return callback(false, ticker_data['ticker']['last']);

        }.bind(this));
    },
}

module.exports = YoBitAdapter;
