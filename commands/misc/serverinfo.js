const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};
module.exports.run = async (bot, message, args) => {
    let userArray = message.content.split(" ");
    let userArgs = userArray.slice(1);
    let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

    if (member.presence.status === 'dnd') member.presence.status = '🔴 Do Not Disturb';
    if (member.presence.status === 'online') member.presence.status = '🟢 Online';
    if (member.presence.status === 'idle') member.presence.status = '🟡 Idle';
    if (member.presence.status === 'offline') member.presence.status = '⚫ Offline';

    let x = Date.now() - member.createdAt;
    let y = Date.now() - message.guild.members.cache.get(member.id).joinedAt;
    const sjoined = Math.floor(y / 86400000);
    const ajoined = Math.floor(x / 86400000);
    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
	const members = message.guild.members.cache;
	const channels = message.guild.channels.cache;
	const emojis = message.guild.emojis.cache;

    const joineddate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
    let status = member.presence.status;

    const userEmbed = new Discord.MessageEmbed()
    .setAuthor(message.guild.name, member.user.displayAvatarURL())
    .setTimestamp()
    .setFooter(`Server info requested by ${message.author.tag} | ${message.author.username} | ${message.author.id}`)
    .setColor(bot.config.colors.main)
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setDescription(`**Guild information for __${message.guild.name}__**`)
    .addField('📋 General', [
        `**❯ ⌨️ Name:** ${message.guild.name}`,
        `**❯ 🆔 ID:** ${message.guild.id}`,
        `**❯ 👥 Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
        `**❯ 🇪🇺 Region:** ${regions[message.guild.region]}`,
        `**❯ 💜 Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
        `**❯ ⚙ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
        `**❯ ⚙ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
        `**❯ ⏲️ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
        '\u200b'
    ])
    .addField('🌐 Statistics', [
        `**❯ 🔰 Role Count:** ${roles.length}`,
        `**❯ 🙂 Emoji Count:** ${emojis.size}`,
        `**❯ 🙂 Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
        `**❯ 🙂 Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
        `**❯ 👥 Member Count:** ${message.guild.memberCount}`,
        `**❯ 👥 Humans:** ${members.filter(member => !member.user.bot).size}`,
        `**❯ 🤖 Bots:** ${members.filter(member => member.user.bot).size}`,
        `**❯ 📁 Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
        `**❯ 🔊 Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
        `**❯ 👥 Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
        '\u200b'
    ])
    .addField('🎮 Presence', [
        `**❯ 🟢 Online:** ${members.filter(member => member.presence.status === 'online').size}`,
        `**❯ 🟡 Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
        `**❯ 🔴 Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
        `**❯ ⚫ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
        '\u200b'
    ])
    .addField("Some helpful links!", "[Invite me](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot) **|** [Vote](https://top.gg/bot/804424228022648832/vote) **|** [Ava support discord](https://discord.gg/vJSjPEEeGU)")
    .setTimestamp();

    message.channel.send(userEmbed);
}



module.exports.help = {
    name:"server-info",
    alias: ["si", "guildinfo", "serverinfo"],
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