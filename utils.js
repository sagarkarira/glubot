var c = require('irc-colors');
var request = require('request');

var logging = require('./config/logger');
var constants = require('./constants');
var config = require('./config/config');

exports.isChannel = isChannel;

function isChannel(string) {
	var channelsArray = config.channels;
	if (~string.indexOf(channelsArray)) {
		return true;
	}
	return false; 
}