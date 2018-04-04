/**
 *
 * Node.JS pricefeed script for GOLOS
 * Created by @Someguy213
 * https://github.com/someguy123
 * Released under GNU GPL 3.0
 * Requires Node v6.3+
 */

var config = require('./config.json');
var exchange = require('./lib/exchange');

if(!('node' in config)) { config['node'] = 'wss://ws.golos.io'; }
if(!('peg' in config)) { config['peg'] = false; }
if(!('peg_multi' in config)) { config['peg_multi'] = 1; }

const golos = require("golos-js");

golos.config.set("websocket", config.node);

var shouldPublish = process.argv.length > 2 && process.argv[2] == "publishnow";
var testrate = process.argv.length > 2 && process.argv[2] == "test";

console.log('...');

var get_price = function(callback) {
    exchange.get_pair('golos','xau', function(price) {
        // console.log('price is', price);
        callback(false, parseFloat(price));
    });
}

async function publish_feed(rate) {
    try {
        var ex_data = rate.toFixed(3) + " GBG";
        log('Amount is: ', ex_data);

        var quote = 1;
        if(config.peg) {
            var pcnt = ((1 - config['peg_multi']) * 100).toFixed(2)
            log('Pegging is enabled. Reducing price by '+pcnt+'% (set config.peg to false to disable)');
            log('Original price (pre-peg):', ex_data);
            quote = 1 / config['peg_multi'];
        }
        var feed_data = { base: ex_data, quote: quote.toFixed(3) + " GOLOS" };

        await golos.broadcast.feedPublishAsync(config.wif, config.name, feed_data);

    } catch (e) {
        console.error(e);
    }
    log('Data published at: ', ""+new Date())
    console.log();
}

async function main(account_data) {
    get_price(async function(err,price) {
        if(err) {
            console.error('error loading prices, will retry later');
            process.exit(1);
        }
        log('GOLOS/XAU(mg) is ', price.toFixed(3));
        await publish_feed(price);
        process.exit(0);
    });
}

main();

