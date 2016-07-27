var fs = require('fs');
var users = require('./users');
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

  if (~who.indexOf(nicksArray)) {
    bot.say(channel, who + "...dude...welcome back!");
  }else{
    bot.say(channel, 'Hi ' + who + 'I think you are new here. ');
    nicksArray.push(who);
    var metaData = {
      nicks : nicksArray
    }
    fs.writeFile('./nicks.json', JSON.stringify(metadata,null,4) , function (err) {
      if (err) {
          console.log(err);
      }
      console.log("File written");
    });
  }

});


bot.addListener('message', function (from, to, message) {
  var noRespectTerms = ['sir', 'Sir', 'maam', 'Maam', 'mam', 'Mam', 'Ma\'am' ]
  for (var i in noRespectTerms) {
    var substring = noRespectTerms[i];
    if (~message.indexOf(substring)) {
      bot.say('#sagark', " Please DON'T use sir or mam to address people. Use nicks instead. ");
      setTimeout(function () {
        bot.say('#sagark', 'Like this - " ' + message.replace(noRespectTerms[i], ' ' ) +  ' " ' );
      }, 1000)
      console.log('Please don\'t use sir or ma\'am here. ');
    }
  }
  //console.log(from + ' => ' + to + ': ' + message);
});


bot.addListener('pm', function (from, message) {
  console.log(from + ' => ME: ' + message);
});
