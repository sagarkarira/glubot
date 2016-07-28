var fs = require('fs');
var constants = require('./constants');
var nicksObj = require('./nicks.json');
var request   = require('request');

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
  if (who == config.botName + '1') {
    bot.say(channel, "Hey everybody " + who + " bot is here. Type !help for commands." )
  }else{
    var nicksArray = nicksObj.nicks;
    if (~nicksArray.indexOf(who)) {
      bot.say(channel, "I missed you. " + who + " Welcome back!" );
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
  if (message[0] === '!') {
    return commandTasks(to, from, message );
  }
  var noRespectTerms = ['sir', 'Sir', 'maam', 'Maam', 'mam', 'Mam', 'Ma\'am' ]
  for (var i in noRespectTerms) {
    var substring = noRespectTerms[i];
    if (~message.indexOf(substring)) {
      bot.say(to, "Hey "  +  from  +" please don't use " + noRespectTerms[i] + " to address people. Use nicks instead. ");
      bot.say(to, 'Message: " ' + message.replace(noRespectTerms[i], "" ) +  ' " ' );
      console.log("Respect Terms used by " + from);
    }
  }
  //console.log(from + ' => ' + to + ': ' + message);
});


function commandTasks(to, from, message) {

  var msgSplit = message.split(' ');
  var command  = msgSplit[0];
  switch (command) {
    case '!quote': return getQuote(to, from, msgSplit); 
    case '!help' : return getHelp(to, from, msgSplit);
    case '!ping' : return pingPong(to, from, msgSplit);
    case '!bark' : return bark(to, from, msgSplit);
    default : bot.say(to, 'It seems like that you type the wrong commnad.' + 
                          'Please type !help ');
                    break;
  }
}

function bark(to,from,msgSplit) {
    bot.say(to, 'bhaun-bhaun' ); 
}

function pingPong(to, from, msgSplit) {
  bot.say(to, 'pong' ); 
                   
}

function getQuote(to, from, msgSplit) {
  var url = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json"
    request(url, function(error, response, html) {
      if (error) {
        console.log (error);
        bot.say(to, 'Sorry could not fetch quote at this time' );
      } 
        var quoteObj = JSON.parse(html);
        var quoteText = quoteObj.quoteText;
        var quoteAuthor = quoteObj.quoteAuthor;
        bot.say(to, quoteText + '-' + quoteAuthor );
    });
}

function getHelp(to, from, msgSplit) {

  bot.say(to, 'Commands: \n'+ 
              '!quote : I will tell you a random quote. \n'+ 
              '!bark : I will bark \n'+ 
              '!wiki <topic> : I will tell you a random quote. \n'+ 
              '!weather <city> : I will tell you a random quote. \n'+ 
              '!help - List all commands.');
}