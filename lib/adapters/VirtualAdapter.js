var request = require('request');
var BTCEAdapter = require('./BTCEAdapter.js'),
    LivecoinAdapter = require('./LivecoinAdapter'),
    LiquiAdapter = require('./LiquiAdapter')
;
/**
 * This adapter mixes BTC/RUR and GOLOS/BTC exchanges
 */

var VirtualAdapter = {
    name: 'VirtualAdapter',
    provides: [
        ['golos','rur']
    ],
    get_pair: function(from,to,callback) {
        // if(['usd', 'eur', 'gbp', 'rub'].indexOf(to) == -1) {
        //     // btc-e is backwards for altcoins, so flip the pair!
        //     var tmp = to;
        //     to = from;
        //     from = tmp;
        // }
        var pair = [from,to].join('_');
        
        if(pair = 'golos_rur') {
            
            return BTCEAdapter.get_pair('btc','rur', function(err, btcrur_price) {
                get_golosbtcprice(function(gprice) {
                    log('BTC/RUR ' + btcrur_price.toString());
                    log('GOLOS/BTC' + gprice.toString());
                    return callback(false, gprice * btcrur_price);
                })
            });

        }
        return callback(true, null);
    },
}

function get_avg(data) {
    // Pull out just the values
    var vals = [];
    for(var k in data) { vals.push(data[k]); }
    return median(vals);
}

function get_golosbtcprice(callback) {
    var adapters = [ LivecoinAdapter, LiquiAdapter ],
        promises = [], output = {};

    for(var a in adapters) {
        if(!adapters.hasOwnProperty(a)) {
            continue;
        }
        var prom = new Promise(function(resolve,reject) {
            exname = adapters[a].name;
            // log(exname);
            // log(a);
            // log(adapters[a]);
            adapters[a].get_pair('GOLOS','BTC',function(err,price) {
                if(err) {
                    // rather than hang up if an exchange is dead
                    // we just log it and move on...
                    console.error('Exchange %s is down! Skipping...',exname, err); 
                    return resolve(); 
                }
                output[exname] = parseFloat(price);
                resolve();
            });
        });
        promises.push(prom);
    }
    

    // Run all of the exchange queries
    // then callback the output
    Promise.all(promises)
    .then(
        function() { callback(get_avg(output)) }, 
        function(e) { log('An unexpected error has occurred', e)}
    );
}

module.exports = VirtualAdapter;
