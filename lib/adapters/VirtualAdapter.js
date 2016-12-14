var request = require('request');
var BTCEAdapter = require('./BTCEAdapter.js');
/**
 * This adapter is just for testing. It is
 * designed to just return mock data.
 */

var ICO_TOKENS = 52233000;

function get_ico_balance(callback) {
    //request('http://btc.blockr.io/api/v1/address/balance/3CWicRKHQqcj1N6fT1pC9J3hUzHw1KyPv3?confirmations=2', function(error,response,body) {
	//if(error || response.statusCode != 200) {
	    //console.error('Invalid response code or server error:',error,response.statusCode);
	    //return callback(true,null);
	//}
	//var address_data = JSON.parse(body);
        //callback(parseFloat(address_data.data.balance));
    //});
    callback(parseFloat(600.18));
}
var VirtualAdapter = {
    name: 'VirtualAdapter',
    provides: [
        ['golos','rur'],
        ['golos','usd']
    ],
    prices: {
        'golos_rur': 0.26,
        'golos_usd': 0.004
    },
    get_pair: function(from,to,callback) {
        // if(['usd', 'eur', 'gbp', 'rub'].indexOf(to) == -1) {
        //     // btc-e is backwards for altcoins, so flip the pair!
        //     var tmp = to;
        //     to = from;
        //     from = tmp;
        // }
        var pair = [from,to].join('_');
        
        if(pair = 'golos_rur') {
            return get_ico_balance(function(bal) {
                console.log('ICO Balance:', bal);
                BTCEAdapter.get_pair('btc','rur', function(err, price) {
                    console.log('BTC/RUR price:', price);
                    var golos_rur = bal * price / ICO_TOKENS;
                    console.log('%s * %s / %s', bal, price, ICO_TOKENS);
                    console.log('Final GOLOS/RUR', golos_rur);
                    callback(false, golos_rur);
                });
            });
        }
        return callback(false, this.prices[pair]);
    },
}

module.exports = VirtualAdapter;
