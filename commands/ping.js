var c = require('irc-colors');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');

//just because it is always there
module.exports = function pingPong(bot, from, to, msgSplit, callback) {
    callback(c.pink('pong'));
}