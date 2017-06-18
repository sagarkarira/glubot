var c = require('irc-colors');
var request = require('request');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');


//code copied from someone else repo. API key is mine. link -

module.exports = function getWeather(bot, from, to, msgSplit, callback) {
    var args = msgSplit;
    if (!args[1]) {
        return callback('Missing arguments. Usage example: !weather Moscow');
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
                    return callback('Sorry, no weather info for that one.');
                } else if (openweatherJson.cod === 200) {
                    // sunrise & sunset are currently not in use, uncomment if you want to use:
                    // var sunrise = new Date(openweatherJson.sys.sunrise * 1000);
                    // var sunset = new Date(openweatherJson.sys.sunset * 1000);

                    var openweatherSummary = 'The current temperature in '
                                            + openweatherJson.name + ', ' + openweatherJson.sys.country
                                            + ' is: ' + openweatherJson.main.temp.toFixed(1) + ' C, '
                                            + openweatherJson.weather[0].description
                                            + '. Humidity: ' + openweatherJson.main.humidity
                                            + '%. Pressure: ' + openweatherJson.main.pressure
                                            + ' hpa. Wind speed: ' + openweatherJson.wind.speed + ' m/s ('
                                            + (openweatherJson.wind.speed * 3.6).toFixed(2) + ' km/h).';

                    return callback(openweatherSummary);
                } else {
                    logging.error('error while trying to get weather for: ', openweatherLink);
                    return callback( 'Sorry, no weather info for that one.');
                }
            }
        });
    }
}
