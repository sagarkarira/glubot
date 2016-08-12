var fs = require('fs');
var querystring = require('querystring');
var irc = require('irc');
var c = require('irc-colors');
var request = require('request');

var utils   = require('../utils');
var logging = require('../config/logger');


module.exports = function(bot, from, to, message) {

    if (message[0] === '!') {
        var msgSplit = message.split(' ');
        var command = msgSplit[0].replace('!','');

        var sendTo = from; // send privately

        if (utils.isChannel(to)) {
          sendTo = to; // send publicly
        }
        externalCommand(command);
        function externalCommand(command) {
            if (fs.existsSync('./commands/' + command + '.js')) { // check if we have an command file
                var output = require('../commands/' + command + '.js')(bot, from, to, msgSplit);
                if (output) {
                    bot.say(sendTo, output);
                }
            } else {
                bot.say(to, 'It seems like that you type the wrong command.' +
                    'Please type !help ');
            }
        };

    }

}
