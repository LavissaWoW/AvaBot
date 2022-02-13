const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = async (bot, message, args) => {
    let userArray = message.content.split(" ");
    let userArgs = userArray.slice(1);
    let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

    const userEmbed = new Discord.MessageEmbed()
    .setAuthor("Avatar", member.user.displayAvatarURL())
    .setTimestamp()
    .setFooter(`User info requested by ${message.author.tag} | ${message.author.username} | ${message.author.id}`)
    .setColor(bot.config.colors.main)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`Avatar for ` + member.toString())
    .setImage(member.user.displayAvatarURL({ dynamic: true }))
    message.channel.send(userEmbed);
}

module.exports.help = {
    name:"avatar", 
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Show user avatar!",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}