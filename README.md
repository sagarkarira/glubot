
# glubot
irc bot for glugnith channel

So I found this npm module **[node-irc](https://github.com/martynsmith/node-irc)** and started tweaking with it. 

You need to understand the structure of the bot. The two main part of this bot is 
  * **observers** 
  * **commands** 
  
  # Observers
  The observers looks into the all the communication which takes place in the channel.  If they detect certain
  keyword they reply accordingly. For example :
  
`16:46 <@sagark> Hello sir can I ask you something`

`16:46 < glubot> Hey sagark please don't use sir to address people. Use nicks instead.`

`16:46 < glubot> Modified: Hello  can I ask you something`

See the bot filter result when someone user **Sir** or **Ma\'am** on the irc. The observer file doing this is [here](https://github.com/sagarkarira/glubot/blob/master/observers/respect-terms.js). 

  # Commands
  The other thing the bot can do is follow your commands. All the commands are in the **command** folder.
  Right now it supports the following commands : 
  * **!weather <city_name>** - tells the weather of your city 
  * **!bark** - bark at you :D
  * **!wp** - fetches wikipedia starting paragraph (**Need Rework**)
  * **!define** - find the meaning of the word
  * **!score** - fetches cricket matches score 
  * **!help** - lists all commands
  * **!ping** - standard ping - pong command
  * **!quote** - displays a random quote
 
So all commands goes into the commands folder. And all the observers goes into the observer folder. If you are new to this you can start start contributing by making your own command like a joke command, or fetch some news etc. 

# How to run this locally ?
* Clone the project
* Run `npm install` to download all the packages.
* Change the irc channel name in the **config.js** file in config folder. 
* Run `node app.js`


  
