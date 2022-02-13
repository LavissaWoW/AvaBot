const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = async (bot, message, args) => {
    message.channel.send("Pong!")
}

module.exports.help = {
    name:"ping", 
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"it's a ping command",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}