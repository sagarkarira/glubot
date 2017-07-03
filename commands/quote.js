var c = require('irc-colors');
var request = require('request');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');

//get random quote
module.exports = function getQuote(bot, from, to, msgSplit, callback) {
    var url = constants.quote.URL;
    request(url, function(error, response, html) {
        if (error) {
            logging.log(error);
            return callback('Sorry could not fetch quote at this time');
        }
        var quoteObj = JSON.parse(html.replace("\\\'","\'"));
        // replacement to avoid problems in parsing JSON with quotes
        var quoteText = quoteObj.quoteText;
        var quoteAuthor = quoteObj.quoteAuthor;
        callback (c.cyan(quoteText) + '-' + c.red(quoteAuthor));
    });
}