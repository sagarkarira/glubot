var c = require('irc-colors');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');

//simple bark by puppy to scare away trespassers
module.exports = function bark(bot, from, to, msgSplit, callback) {
     callback (c.cyan('bhaun-bhaun'));
}
