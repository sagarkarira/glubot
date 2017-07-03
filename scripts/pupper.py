""" Script that gets a cute pupper from /r/rarepuppers. Cuteness guaranteed. """

# pupper.py - get a rare pupper from /r/rarepuppers
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

def get_pupper():
    """ Get a cute pupper. We can get a random pupper because
        all puppers are G O O D B O Y E S.
    """
    reddit = init_reddit()
    rpuppers = reddit.subreddit('rarepuppers')
    post = random.choice(list(rpuppers.hot(limit=100)))
    return '{title} - {url}'.format(title=post.title, url=post.url)

if __name__ == '__main__':
    print(get_pupper())
