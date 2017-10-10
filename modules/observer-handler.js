var fs = require('fs');
var c = require('irc-colors');
var utils = require('../utils');


module.exports = (bot, from, to, message) => {

  if (message && message.length > 2 && message[0] != '!') {
    var sendTo = from; // send privately
    if (utils.isChannel(to)) {
      sendTo = to; // send publicly
    }

    fs.readdirSync('./observers/').forEach( file => {
      var output = require('../observers/' + file)(bot, from, to, message);
      if (output) {
        bot.say(sendTo, output);
      }
    });

  }
};

