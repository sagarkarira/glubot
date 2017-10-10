var c = require('irc-colors');

var fs = require('fs');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');    

module.exports = (bot, from, to, message) => {
    var noRespectTerms = constants.terms.RESPECT;
    var messageArray = message.toString().replace(/[^\w\s]|_|\d/g, " ").split(" ");
    for (var i in noRespectTerms) {
        var substring = noRespectTerms[i];
        if (~messageArray.indexOf(substring)) {
            logging.info("Respect Terms used by " + from);
            return ("Hey " + from + " please don't use " + c.pink(noRespectTerms[i]) + " to address people. Use nicks instead.\n" 
            	    + c.underline.green('Modified:') + ' ' + message.toString().replace(noRespectTerms[i], ""));
        }
    }
}

