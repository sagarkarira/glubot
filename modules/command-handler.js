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
        var nick = from;
        var sendTo = from; // send privately

        if (utils.isChannel(to)) {
            sendTo = to; // send publicly
        }

        if (!utils.commandExists(command)) {
            bot.say(to, 'It seems like that you type the wrong command.' +
                    'Please type !help ');
            return ;
        }

        if (!utils.commandEnabled(command) ) {
            bot.say(sendTo, 'Command not enabled by my master');
            return;
        } 

        if (utils.adminCommand(nick, command) ) {
            bot.say(sendTo, 'Only my master can use this command');
            return;
        } 

        if (command === 'restart') {
            utils.clearCache(function(output) {
                bot.say(sendTo, output);
                return;
            })
        }
        executeCommands(command);

        function executeCommands(command) {
            if (fs.existsSync('./commands/' + command + '.js')) { // check if we have a command file
                require('../commands/' + command + '.js')(bot, from, to, msgSplit, function(output){
                    if (output) {
                        bot.say(sendTo, output);
                        return;
                    }
                });
              
            } else {
                bot.say(to, 'It seems like that you type the wrong command.' +
                    'Please type !help ');
                return ;
            } 
        }   
    }
}



