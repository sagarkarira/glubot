var fs = require('fs');
var querystring = require('querystring');
var irc = require('irc');

var constants = require('./constants');
var nicksObj = require('./nicks.json');
var request = require('request');

var config = {
    channels: ['#sagark'],
    server: "irc.freenode.net",
    botName: "puppy"
};


var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

//Check for user joins to channel
bot.addListener("join", function(channel, who) {
    if (who == config.botName + '1') {
        bot.say(channel, "Hey everybody " + who + " bot is here. Type !help for commands.")
    } else {
        var nicksArray = nicksObj.nicks;
        if (~nicksArray.indexOf(who)) {
            bot.say(channel, "I missed you. " + who + " Welcome back!");
        } else {
            bot.say(channel, 'Hi ' + who + ' a warm welcome to  ' + channel);
            nicksArray.push(who);
            var metaData = {
                nicks: nicksArray
            }
            fs.writeFile('./nicks.json', JSON.stringify(metaData, null, 4), function(err) {
                if (err) {
                    console.log(err);
                }
                console.log("Added new user " + who + " to file");
            });
        }
    }
});


bot.addListener('message', function(from, to, message) {
    if (message[0] === '!') {
        return commandTasks(to, from, message);
    }
    var noRespectTerms = ['sir', 'Sir', 'maam', 'Maam', 'mam', 'Mam', 'Ma\'am']
    for (var i in noRespectTerms) {
        var substring = noRespectTerms[i];
        if (~message.indexOf(substring)) {
            bot.say(to, "Hey " + from + " please don't use " + noRespectTerms[i] + " to address people. Use nicks instead. ");
            bot.say(to, 'Modified: " ' + message.replace(noRespectTerms[i], "") + ' " ');
            console.log("Respect Terms used by " + from);
        }
    }
    //console.log(from + ' => ' + to + ': ' + message);
});


function commandTasks(to, from, message) {

    var msgSplit = message.split(' ');
    var command = msgSplit[0];
    switch (command) {
        case '!quote':
            return getQuote(to, from, msgSplit);
        case '!help':
            return getHelp(to, from, msgSplit);
        case '!ping':
            return pingPong(to, from, msgSplit);
        case '!bark':
            return bark(to, from, msgSplit);
        case '!wp':
            return getWiki(to, from, msgSplit);
        case '!define':
            return getDefinition(to, from, msgSplit);
        default:
            bot.say(to, 'It seems like that you type the wrong commnad.' +
                'Please type !help ');
            break;
    }
}

function getDefinition(to, from, msgSplit) {
    var args = msgSplit;
    if (!args[1]) {
        bot.say(to, 'Missing arguments. Usage example: !define puppy');
    } else {
        var link = 'http://api.pearson.com/v2/dictionaries/entries?headword=' + args[1];
        request(link, function(error, response, body) {
            if (error) {
                logging.error('Error in fetching definition ' + error);
                return;
            }
            var content = JSON.parse(body);
            var count = 0;
            if (content.results.length == 0) {
                bot.say(to, 'Sorry, ' + args[1] + ' was too difficult to find.');
            } else {
                bot.say(to, 'Definition :');
                for (var i in content.results) {
                    if (content.results[i].senses[0].subsenses) {
                        meaning =   content.results[i].senses[0].subsenses[0].definition;
                    } else {
                        meaning =   content.results[i].senses[0].definition;
                    }
                    if (meaning) {
                        count++;
                        bot.say(to, count + '. ' + meaning);
                    }
                }
            }
        });
    }
}

function getWiki(to, from, msgSplit) {
    var args = msgSplit;
    if (!args[1]) {
        bot.say(to, 'Missing arguments. Usage example: !wp NodeJS');
    } else {
        args.shift(); // removes first arg and moves others by -1
        args = args.join(' '); // adds ' ' between every element of array and saves as string
        var titleSecondTry = args; // save a copy for later use - if string has to be capitalized: martin scorsese -> Martin Scorsese
        var title = querystring.stringify({
            titles: args
        }); // add titles= before string
        var wiki = 'https://en.wikipedia.org/w/api.php?continue=&action=query&' + title + '&indexpageids=&prop=extracts&exintro=&explaintext=&format=json';

        request(wiki, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var wikiSummary = JSON.parse(body);
                var pageId = wikiSummary.query.pageids[0]; // get pageID

                // if pageId is -1 then the article does not exist
                if (pageId === '-1') {

                    // Try again with changing first letter of every word to upper case
                    titleSecondTry = titleSecondTry.replace(/[^\s]+/g, function(word) {
                        return word.replace(/^./, function(first) {
                            return first.toUpperCase();
                        });
                    });

                    titleSecondTry = querystring.stringify({
                        titles: titleSecondTry
                    });

                    wiki = 'https://en.wikipedia.org/w/api.php?continue=&action=query&' + titleSecondTry + '&indexpageids=&prop=extracts&exintro=&explaintext=&format=json';
                    request(wiki, function(err, res, bod) {
                        if (!err && res.statusCode === 200) {
                            wikiSummary = JSON.parse(bod);
                            pageId = wikiSummary.query.pageids[0];
                            if (pageId === '-1') {
                                bot.say(to, 'Article does not exist or could not be found. Sorry :C');
                            } else {
                                wikiSummary = wikiSummary.query.pages[pageId].extract;
                                wikiSummary = wikiSummary.slice(0, 280);
                                var checkRedirect = wikiSummary.slice(0, 70);
                                if (checkRedirect === 'This is a redirect from a title with another method of capitalisation.') {
                                    bot.say(to, 'Article is redirecting, please use the following link: https://en.wikipedia.org/wiki/' + titleSecondTry.slice(7));
                                } else {
                                    wikiSummary = wikiSummary.concat('... Read more: ' + 'https://en.wikipedia.org/wiki/' + titleSecondTry.slice(7));
                                    bot.say(to, wikiSummary);
                                }
                            }
                        }
                    });
                } else {
                    wikiSummary = wikiSummary.query.pages[pageId].extract;
                    wikiSummary = wikiSummary.slice(0, 280);
                    var checkRedirect = wikiSummary.slice(0, 70);
                    if (checkRedirect === 'This is a redirect from a title with another method of capitalisation.') {
                        bot.say(to, 'Article is redirecting, please use the following link: https://en.wikipedia.org/wiki/' + title.slice(7));
                    } else {
                        wikiSummary = wikiSummary.concat('... Read more: ' + 'https://en.wikipedia.org/wiki/' + title.slice(7));
                        bot.say(to, wikiSummary);
                    }
                }
            }
        });
    }
}

function bark(to, from, msgSplit) {
    bot.say(to, 'bhaun-bhaun');
}

function pingPong(to, from, msgSplit) {
    bot.say(to, 'pong');

}

function getQuote(to, from, msgSplit) {
    var url = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json"
    request(url, function(error, response, html) {
        if (error) {
            console.log(error);
            bot.say(to, 'Sorry could not fetch quote at this time');
        }
        var quoteObj = JSON.parse(html);
        var quoteText = quoteObj.quoteText;
        var quoteAuthor = quoteObj.quoteAuthor;
        bot.say(to, quoteText + '-' + quoteAuthor);
    });
}

function getHelp(to, from, msgSplit) {

    bot.say(to, 'Commands: \n' +
        '!bark           : I will bark \n' +
        '!define <word>  : I will find the meaning of the word for you. \n ' +
        '!help           : I will list all the things I can do) \n' +
        '!quote          : I will tell you a random quote. \n' +
        '!ping           : Wanna play ping pong \n' +
        '!wiki <topic>   : I will get wikipedia topic intro. \n' +
        '!weather <city> : I will find the temperature of your city. \n';
        
}
