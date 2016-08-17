var c = require('irc-colors');
var request = require('request');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');


//gets meaning of word
module.exports = function getDefinition(bot, from, to, msgSplit, callback) {
    var args = msgSplit;
    var reply = '';
    if (!args[1]) {
        return callback ('Missing arguments. Usage example: !define puppy');
    } else {
        var link = 'http://api.pearson.com/v2/dictionaries/entries?headword=' + args[1];
        request(link, function(error, response, body) {
            if (error) {
                logging.error('Error in fetching definition ' + error);
                return callback('Error in fetching definition');
            }
            var content = JSON.parse(body);
            var count = 0;
            if (content.results.length == 0) {
                return callback( 'Sorry, ' + args[1] + ' was too difficult to find.');
            } else {
            	reply += c.red('Definition :');
                for (var i in content.results) {
                    if (content.results[i].senses[0].subsenses) {
                        meaning =   content.results[i].senses[0].subsenses[0].definition;
                    } else {
                        meaning =   content.results[i].senses[0].definition;
                    }
                    if (meaning) {
                        count++;
                        reply +=  c.red(count + '. ' ) + meaning;
                        callback(reply);
                    }
                }
            }
        });
    }
}
