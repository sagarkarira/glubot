""" Script that gets a Joke from /r/jokes. Funniness not guaranteed!"""

# joke.py - get a joke from /r/jokes
#
# Copyright (C) 2017 Param Singh
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA

import random
from scripts.utils import init_reddit

def get_joke():
    """ Get a random joke from /r/jokes """
    reddit = init_reddit()
    rpuppers = reddit.subreddit('jokes')
    post = random.choice(list(filter(lambda x: not x.over_18, rpuppers.hot(limit=100))))
    return '{title}\n{text}'.format(title=post.title, text=post.selftext)

if __name__ == '__main__':
    print(get_joke())
