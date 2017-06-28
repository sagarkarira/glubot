var c = require('irc-colors')

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');

//Guide for teaching new commands to puppy
module.exports = function contribute(bot, from, to, msgSplit, callback) {
     callback (c.black('The Ultimate Guide To Teach Me new Commands\n') + '\n' +
               c.cyan('My masters made my intelligence with a lot of care so that') + '\n' +
               c.cyan('teaching new commands is very easy. My whole intelligence is placed') + '\n' +
               c.cyan('at https://github.com/sagarkarira/glubot.git you can get it with') + '\n' +
               c.bgwhite.black('git clone https://github.com/sagarkarira/glubot.git') + '\n' +
               c.cyan('Now after cloning navigate to the cloned repo, do ') + c.bgwhite.black('npm install') + '\n' +
               c.cyan('now all the required modules will be installed, now change the config/config.js') + '\n' + 
               c.cyan('to the values like make yourself admin, give a name of an irc channel etc. Then I am') + '\n' +
               c.cyan('all yours, you can do testing with me, teach me new commands, to teach commands ') + '\n' +
               c.cyan('create a new file commands/<command_name>.js, also add its entry in command-config.json') + '\n' +
               c.cyan('see other entries for better understanding, then code the command in your created file,') + '\n' + 
               c.cyan('its all done, you can test its working by running npm app.js in the terminal and joining the ') + '\n' +
               c.cyan('channel you gave reference in config.js') + '\n' + 
               c.cyan('Read README.md for better understanding'));
}
