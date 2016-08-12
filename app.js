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
    greetings(bot, channel, who);
});


bot.addListener('message', function(from, to, message) {
    logging.info({'from' : from , 'to': to, 'message':message});
    observerHandler(bot, from, to, message);
    commandHandler(bot, from , to , message);
    // var sendTo = from; // send privately
    // if (utils.isChannel(to)) {
    //   sendTo = to; // send publicly
    // }
    // if (message[0] === '!') {
    //     return commandTasks(to, from, message);
    // }
    //console.log(from + ' => ' + to + ': ' + message);
});

//switch case to control all commands
function commandTasks(to, from, message) {


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
        case '!weather':
            return getWeather(to, from, msgSplit);
        default:
            bot.say(to, 'It seems like that you type the wrong commnad.' +
                'Please type !help ');
            break;
    }
}

//code copied from someone else repo. API key is mine. link -
function getWeather(to, from, msgSplit) {
    var args = msgSplit;
    if (!args[1]) {
        bot.say(to, 'Missing arguments. Usage example: !weather Moscow');
    } else {
        var currentWeather = constants.weather.URL;
        var metric = constants.weather.METRIC;
        var apiKey = constants.weather.API_KEY;
        var userInput;
        args.shift();

        // check if user wants to search by ZIP code or by city name
        if (args[0] === 'zip') {
            userInput = 'zip=' + args[1];
        } else {
            args = args.join('');
            userInput = 'q=' + args;
        }
        userInput += metric + apiKey;
        var openweatherLink = currentWeather + userInput;

        request(openweatherLink, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var openweatherJson = JSON.parse(body);
                if (openweatherJson.cod === '404') {
                    logging.error('error while trying to get weather, "cod" code: ', openweatherJson.cod);
                    bot.say(to, 'Sorry, no weather info for that one.');
                } else if (openweatherJson.cod === 200) {
                    // sunrise & sunset are currently not in use, uncomment if you want to use:
                    // var sunrise = new Date(openweatherJson.sys.sunrise * 1000);
                    // var sunset = new Date(openweatherJson.sys.sunset * 1000);

                    var openweatherSummary = 'The current temperature in ' + openweatherJson.name +
                                            ', ' + openweatherJson.sys.country + ' is: ' + openweatherJson.main.temp.toFixed(1) +
                                            ' C, ' + openweatherJson.weather[0].description + '. Pressure: ' + openweatherJson.main.pressure +
                                            ' hpa. Wind speed: ' + openweatherJson.wind.speed + ' m/s (' + (openweatherJson.wind.speed * 3.6).toFixed(2) + ' km/h).';

                    bot.say(to, openweatherSummary);
                } else {
                    logging.error('error while trying to get weather for: ', openweatherLink);
                    bot.say(to, 'Sorry, no weather info for that one.');
                }
            }
        });
    }
}

//gets meaning of word
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
                bot.say(to, c.red('Definition :'));
                for (var i in content.results) {
                    if (content.results[i].senses[0].subsenses) {
                        meaning =   content.results[i].senses[0].subsenses[0].definition;
                    } else {
                        meaning =   content.results[i].senses[0].definition;
                    }
                    if (meaning) {
                        count++;
                        bot.say(to, c.red(count + '. ' ) + meaning);
                    }
                }
            }
        });
    }
}

//someone else code - need to change a lot. not working great
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

//simple bark by puppy to scare away trespassers
function bark(to, from, msgSplit) {
    bot.say(to, c.cyan('bhaun-bhaun'));
}

//just because it is always there
function pingPong(to, from, msgSplit) {
    bot.say(to, c.pink('pong'));
}

//get random quote
function getQuote(to, from, msgSplit) {
    var url = constants.quote.URL;
    request(url, function(error, response, html) {
        if (error) {
            logging.log(error);
            bot.say(to, 'Sorry could not fetch quote at this time');
        }
        var quoteObj = JSON.parse(html);
        var quoteText = quoteObj.quoteText;
        var quoteAuthor = quoteObj.quoteAuthor;
        bot.say(to, c.cyan(quoteText) + '-' + c.red(quoteAuthor));
    });
}

//all command manual
function getHelp(to, from, msgSplit) {

    bot.say(to, c.underline.red('Commands:') + '\n'+
        c.red('!bark           ')  +  ': I will bark \n' +
        c.red('!define <word>  ')  +  ': I will find the meaning of the word for you. \n' +
        c.red('!help           ')  +  ': I will list all the things I can do) \n' +
        c.red('!quote          ')  +  ': I will tell you a random quote. \n' +
        c.red('!ping           ')  +  ': I will play ping pong with you \n' +
        c.red('!wp <topic>     ')  +  ': I will get wikipedia topic intro. \n' +
        c.red('!weather <city> ')  +  ': I will find the temperature of your city. \n');
}
