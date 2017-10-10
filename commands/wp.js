var c = require('irc-colors');
var request = require('request');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');
var querystring = require('querystring');


//someone else code - need to change a lot. not working great
module.exports = (bot, from, to, msgSplit, callback) => {
    var args = msgSplit;
    if (!args[1]) {
        return callback('Missing arguments. Usage example: !wp NodeJS');
    } else {
        args.shift(); // removes first arg and moves others by -1
        args = args.join(' '); // adds ' ' between every element of array and saves as string
        var titleSecondTry = args; // save a copy for later use - if string has to be capitalized: martin scorsese -> Martin Scorsese
        var title = querystring.stringify({
            titles: args
        }); // add titles= before string
        var wiki = 'https://en.wikipedia.org/w/api.php?continue=&action=query&' + title + '&indexpageids=&prop=extracts&exintro=&explaintext=&format=json';

        request(wiki, (error, response, body) =>{
            if (!error && response.statusCode === 200) {
                var wikiSummary = JSON.parse(body);
                var pageId = wikiSummary.query.pageids[0]; // get pageID

                // if pageId is -1 then the article does not exist
                if (pageId === '-1') {

                    // Try again with changing first letter of every word to upper case
                    titleSecondTry = titleSecondTry.replace(/[^\s]+/g, word => {
                        return word.replace(/^./, first => first.toUpperCase());
                    });

                    titleSecondTry = querystring.stringify({
                        titles: titleSecondTry
                    });

                    wiki = 'https://en.wikipedia.org/w/api.php?continue=&action=query&' + titleSecondTry + '&indexpageids=&prop=extracts&exintro=&explaintext=&format=json';
                    request(wiki, (err, res, bod) => {
                        if (!err && res.statusCode === 200) {
                            wikiSummary = JSON.parse(bod);
                            pageId = wikiSummary.query.pageids[0];
                            if (pageId === '-1') {
                                return callback ('Article does not exist or could not be found. Sorry :C');
                            } else {
                                wikiSummary = wikiSummary.query.pages[pageId].extract;
                                wikiSummary = wikiSummary.slice(0, 280);
                                var checkRedirect = wikiSummary.slice(0, 70);
                                if (checkRedirect === 'This is a redirect from a title with another method of capitalisation.') {
                                    return callback('Article is redirecting, please use the following link: https://en.wikipedia.org/wiki/' + titleSecondTry.slice(7));
                                } else {
                                    wikiSummary = wikiSummary.concat('... Read more: ' + 'https://en.wikipedia.org/wiki/' + titleSecondTry.slice(7));
                                    return callback (wikiSummary);
                                }
                            }
                        }
                    });
                } else {
                    wikiSummary = wikiSummary.query.pages[pageId].extract;
                    wikiSummary = wikiSummary.slice(0, 280);
                    var checkRedirect = wikiSummary.slice(0, 70);
                    if (checkRedirect === 'This is a redirect from a title with another method of capitalisation.') {
                        return callback('Article is redirecting, please use the following link: https://en.wikipedia.org/wiki/' + title.slice(7));
                    } else {
                        wikiSummary = wikiSummary.concat('... Read more: ' + 'https://en.wikipedia.org/wiki/' + title.slice(7));
                        return callback(wikiSummary);
                    }
                }
            }
        });
    }
}
