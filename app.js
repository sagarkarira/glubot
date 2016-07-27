var fs = require('fs');
var constants = require('./constants');
var nicksObj = require('./nicks.json');

var config = {
    channels: ['#sagark'],
    server: "irc.freenode.net",
	   botName: "marty"
};

var irc = require('irc');

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// Listen for joins
bot.addListener("join", function(channel, who) {
  var nicksArray = nicksObj.nicks;
  console.log(nicksArray);
  if (~nicksArray.indexOf(who)) {
    bot.say(channel, "I missed you " + who + " Welcome back!" );
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

});


bot.addListener('message', function (from, to, message) {
  var noRespectTerms = ['sir', 'Sir', 'maam', 'Maam', 'mam', 'Mam', 'Ma\'am' ]
  for (var i in noRespectTerms) {
    var substring = noRespectTerms[i];
    if (~message.indexOf(substring)) {
      bot.say(channel, " Please DON'T use sir or mam to address people. Use nicks instead. ");
      setTimeout(function () {
        bot.say(channel, 'Like this - " ' + message.replace(noRespectTerms[i], ' ' ) +  ' " ' );
      }, 1000)
      console.log('Please don\'t use sir or ma\'am here. ');
    }
  }
  //console.log(from + ' => ' + to + ': ' + message);
});


bot.addListener('pm', function (from, message) {
  console.log(from + ' => ME: ' + message);
});
