var request = require('request');

/**
 * This adapter is just for testing. It is
 * designed to just return mock data.
 */
var VirtualAdapter = {
    name: 'VirtualAdapter',
    provides: [
        ['golos','rur'],
        ['golos','usd']
    ],
    prices: {
        'golos_rur': 0.13,
        'golos_usd': 0.002
    },
    get_pair: function(from,to,callback) {
        // if(['usd', 'eur', 'gbp', 'rub'].indexOf(to) == -1) {
        //     // btc-e is backwards for altcoins, so flip the pair!
        //     var tmp = to;
        //     to = from;
        //     from = tmp;
        // }
        var pair = [from,to].join('_');
        
        return callback(false, this.prices[pair]);
    },
}

module.exports = VirtualAdapter;