/*
 * joke.js - get a joke from /r/jokes
 *
 * Copyright (C) 2017 Param Singh
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

var c = require('irc-colors');

var constants = require('../constants');
var utils = require('../utils');
var logging = require('../config/logger');

module.exports = function bark(bot, from, to, msgSplit, callback) {
    var spawn = require('child_process').spawn;
    var pupper = spawn('python3', ['-m', 'scripts.joke']);
    pupper.stdout.on('data', (data) => {
        callback(data);
    });
    pupper.stderr.on('data', (data) => {
        logging.error(data);
        callback(data);
    });
}
