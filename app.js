var fs = require('fs');
var querystring = require('querystring');
var irc = require('irc');
var c = require('irc-colors');
var request = require('request');

var utils   = require('./utils');
var logging = require('./config/logger');
var constants = require('./constants');
var nicksObj = require('./nicks.json');
var config = require('./config/config');
var greetings = require('./greetings');
var observerHandler = require('./modules/observer-handler');
var commandHandler  = require('./modules/command-handler');

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});


bot.addListener('error', function(message) {
   logging.error('Bot error ' +message);
 });


//Check for user joins to channel
bot.addListener("join", function(channel, who) {
    logging.info(who + " joined " + channel);
    greetings(bot, channel, who);
});


bot.addListener('message', function(from, to, message) {
    logging.info({'from' : from , 'to': to, 'message':message});
    observerHandler(bot, from, to, message);
    commandHandler(bot, from , to , message);
});

