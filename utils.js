var c = require('irc-colors');
var request = require('request');
var fs 		= require('fs');

var logging = require('./config/logger');
var constants = require('./constants');
var config = require('./config/config');
var cmdcfg  = require('./command-config');

exports.isChannel = isChannel;
exports.commandExists = commandExists;
exports.adminCommand = adminCommand;
exports.commandEnabled = commandEnabled;
exports.clearCache 	= clearCache;

function isChannel(string) {
	var channelsArray = config.channels;
	if (~string.indexOf(channelsArray)) {
		return true;
	}
	return false; 
}

function commandExists(command) {
	if (cmdcfg.command) {
		return true;
	}
	return false;

}

function commandEnabled(command) {
	if (cmdcfg[command].enabled === 1) {
		return true;
	}
	return false;
}

function adminCommand (nick, command) {
	if (!cmdcfg[command].admin) {
		return false;
	}
	return isAdmin(nick, command);
}
function isAdmin(nick, command) {
	console.log(command);
	console.log(nick);
	if (~nick.indexOf(config.admins) ) {
		return false;
	}
	return true;
}

function clearCache(callback) {
	
	fs.readdirSync('./commands/').forEach(function (file) {
    	delete require.cache[require.resolve('./commands/'+file)];
  	});

  	fs.readdirSync('./observers/').forEach(function (file) {
    	delete require.cache[require.resolve('./observers/'+file)];
  	});

  	delete require.cache[require.resolve('./nicks.json')];
  	delete require.cache[require.resolve('./command-config.json')];
  	delete require.cache[require.resolve('./greetings.js')];
  	delete require.cache[require.resolve('./config/config.js')];

  	//help.buildString();

  	// a message for the IRC bot to send to the admin user who called !reload
  	return callback('Commands, Observeres and configs are now reloaded!');

};
