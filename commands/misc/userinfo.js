const Discord = require('discord.js');
const moment = require('moment');

module.exports.run = async (bot, message, args) => {
    let userArray = message.content.split(" ");
    let userArgs = userArray.slice(1);
    let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

    if (member.presence.status === 'dnd') member.presence.status = '🔴 Do Not Disturb';
    if (member.presence.status === 'online') member.presence.status = '🟢 Online';
    if (member.presence.status === 'idle') member.presence.status = '🟡 Idle';
    if (member.presence.status === 'offline') member.presence.status = '⚫ Offline';

    let createdAt = moment.duration(moment().diff(moment(member.user.createdAt)))
    let joinedAt = moment.duration(moment().diff(moment(message.guild.members.cache.get(member.id).joinedAt)))
    const sjoined = (joinedAt.years() > 0 ? joinedAt.years() + " year" + (joinedAt.years() > 1 ? "s" : "") + " " : "") + 
                    (joinedAt.months() > 0 ? joinedAt.months() + " month" + (joinedAt.months() > 1 ? "s" : "") + " " : "") +
                    (joinedAt.days() > 0 ? joinedAt.days() + " day" + (joinedAt.days() > 1 ? "s" : "") : "") + " ago"
    const ajoined = (createdAt.years() > 0 ? createdAt.years() + " year" + (createdAt.years() > 1 ? "s" : "") + " " : "") + 
                    (createdAt.months() > 0 ? createdAt.months() + " month" + (createdAt.months() > 1 ? "s" : "") + " " : "") +
                    (createdAt.days() > 0 ? createdAt.days() + " day" + (createdAt.days() > 1 ? "s" : "") : "") + " ago"

    const joineddate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
    let status = member.presence.status;
    let nickname = message.guild.members.cache.get(member.id).nickname
    const userEmbed = new Discord.MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setTimestamp()
    .setFooter(`User info requested by ${message.author.tag} | ${message.author.username} | ${message.author.id}`)
    .setColor(bot.config.colors.main)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`Info about ${member.user.username}`)
    .addField("🆔 Member ID", member.id, true)
    .addField("✏️ Member name/nickname",`${member.user.username}/${nickname ? nickname : "None"}`, true)
    .addField('🔰 Roles', `<@&${member._roles.join('> <@&')}>`,)
    .addField("🗓️ Account Created On:", ` ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} \n> ${ajoined}`, true) 
    .addField('🗓️ Joined the server At', `${joineddate} \n> ${sjoined}`, true)
    .addField("🎮 Status", status)
    .addField("Some helpful links!", "[Invite me](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot) **|** [Vote](https://top.gg/bot/804424228022648832/vote) **|** [Ava support discord](https://discord.gg/vJSjPEEeGU)")

    message.channel.send(userEmbed);
}



module.exports.help = {
    name:"user-info", 
    alias: ["ui", "memberinfo", "userinfo"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"User info!",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}
