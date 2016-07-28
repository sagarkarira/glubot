var fs = require('fs');
var constants = require('./constants');
var nicksObj = require('./nicks.json');

var config = {
    channels: ['#sagark'],
    server: "irc.freenode.net",
	   botName: "puppy"
};

var irc = require('irc');

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

//Check for user joins to channel
bot.addListener("join", function(channel, who) {
  if (who == config.botName) {
    bot.say(channel, "Hey everybody " + who + "bot is here. Type !help for commands." )
  }else{
    var nicksArray = nicksObj.nicks;
    if (~nicksArray.indexOf(who)) {
      bot.say(who, "I missed you. " + who + " Welcome back!" );
    }else{
      bot.say(channel, 'Hi ' + who + ' a warm welcome to  ' + channel );
      nicksArray.push(who);
      var metaData = {
        nicks : nicksArray
      }
      fs.writeFile('./nicks.json', JSON.stringify(metaData,null,4) , function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Added new user " + who + " to file");
      });
    }
  }
});


bot.addListener('message', function (from, to, message) {
  var noRespectTerms = ['sir', 'Sir', 'maam', 'Maam', 'mam', 'Mam', 'Ma\'am' ]
  for (var i in noRespectTerms) {
    var substring = noRespectTerms[i];
    if (~message.indexOf(substring)) {
      bot.say(to, "Hey "  +  from  +" please don't use " + noRespectTerms[i] + " to address people. Use nicks instead. ");
      setTimeout(function () {
        bot.say(to, 'Message: " ' + message.replace(noRespectTerms[i], " " ) +  ' " ' );
      }, 1000)
      console.log("Respect Terms used by " + from);
    }
  }
  //console.log(from + ' => ' + to + ': ' + message);
});


bot.addListener('pm', function (from, message) {
  console.log(from + ' => ME: ' + message);
});
