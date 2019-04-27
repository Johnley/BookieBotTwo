const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

var methods = {};

methods.timestamp = function(agent) {
	agent.add('Current Time in Unix Timestamp: ' + Math.floor(Date.now() / 1000))
};
methods.currentDate = function(agent) {
	agent.add('Current Date is: ' + new Date().toISOString().slice(0, 10))
};
methods.memberCount = function(agent){
    const guild = client.guilds.get('527205605681922055')
    agent.add(`There are ${guild.memberCount} people in Bookie's Hangout.`)
};

module.exports = methods;