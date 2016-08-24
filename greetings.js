var fs = require('fs');
var c = require('irc-colors');


var utils = require('./utils.js');
var logging = require('./config/logger');
var constants = require('./constants');
var nicksObj = require('./nicks.json');
var config = require('./config/config');

module.exports = function (bot, channel, who) {
    
    if (who == config.botName + '1') {
        bot.say(channel, "Hey everybody " + c.red(who) + " bot is here. Type" + c.green(' !help ') + "for commands.")
    } else {
        var nicksArray = nicksObj.nicks;
        if (~nicksArray.indexOf(who)) {
            bot.say(channel, "Welcome back " + c.red(who) );
        } else {
            bot.say(channel, 'Hi ' + who + ' a warm welcome to  ' + channel);
            nicksArray.push(who);
            var metaData = {
                nicks: nicksArray
            }
            fs.writeFile('./nicks.json', JSON.stringify(metaData, null, 4), function(err) {
                if (err) {
                    logging.log(err);
                }
                logging.info("Added new user " + who + " to file");
            });
        }
    }
}

