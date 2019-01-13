/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!");
});

controller.hears(['hello', 'hi'], ['direct_message', 'message', 'direct_mention'], function (bot, message) {
    bot.reply(message, 'Hello!');
});

controller.hears(['course', 'courses', 'learning', 'training'], ['direct_message','mention', 'direct_mention'], function ( bot, message) {
	bot.reply( message, 'At the digital garage we provide free training in a number of areas including: 1)Build Your Confidence, 2)Skills for work, 3)Grow my career, 4)Grow or start a new business');
});

controller.hears(['online', 'safe', 'safety', '1'], ['direct_message', 'mention', 'direct_message'], function ( bot, message) {
	bot.reply( message, 'We have the following courses for building confidence: 11)First Steps Online, 12)Stay Safe Online');
});

controller.hears(['work', 'email', 'spreadsheet', 'Cover', 'cv', '2'], ['direct_message', 'mention', 'direct_message'], function ( bot, message) {
	bot.reply( message, 'We have the following courses for Skill for Work: 21)Email for Work, 22)Spreadsheets for Beginners 23) Presentations for work, 24) Build Your Personal Brand, 25) Write a Cover Letter, 26) Buile a CV');
});

controller.hears(['social', 'twitter', 'facebook', '3'], ['direct_message', 'mention', 'direct_message'], function ( bot, message) {
	bot.reply( message, 'We have the following courses for social media: 31)An Introduction to Digital Advertising, 32)Build a digital marketing plan, 33)Social Media Strategy, 34)Writing for Social media, 35)Answering question with data');
});

controller.hears(['business', '4'], ['direct_message', 'mention', 'direct_message'], function ( bot, message) {
	bot.reply ( message, 'We have a number of courses 41)Start Your Own Business, 42)Get your Business visible on Google, 43)Build A Simpler Website For Your Business, 44)An Introduction to Digital Marketing, 45)1:1 Coaching for YOur Career Or Business ');
});


controller.hears(['coding', 'programming', 'developing', '5'], ['direct_message', 'mention', 'direct_message'], function ( bot, message) {
	bot.reply ( message, 'We have a course called 51)Introduction to Coding, which may be of use');
});



controller.hears(['Visible on Google', '42'], ['direct_message', 'mention', 'direct_message'], function ( bot, message){
	bot.reply ( message, 'For anyone who wants to get there business more visible online. We covercreating a listing for your business on Google Maps and provide training in how to monitor and maintain your website presence on Google Search You\'ll learn how to use the Google MyBusiness platform to manage yourbusiness presence on Google.' );
});
/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});
