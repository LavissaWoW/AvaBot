const Discord = require("discord.js")

module.exports.replace = async function (bot, message, msg) {
    for(ph in placeholders) {
        if(msg.includes(ph)) {
            msg = msg.replace(ph, placeholders[ph](bot, message))
        }
    }
    return msg
}

let placeholders = {
    "{user}": function(bot, message) {
        return message.author
    },
    "{user_tag}": function(bot, message) {
        return `${message.author.username}#${message.author.discriminator}`
    },
    "{user_name}": function(bot, message) {
        return message.author.username
    },
    "{user_discriminator}": function(bot, message) {
        return message.author.discriminator
    },
    "{user_avatar}": function(bot, message) {
        return message.author.displayAvatarURL()
    },
    "{user_id}": function(bot, message) {
        return message.author.id
    },
    "{user_nickname}": function(bot, message) {
        let nick = message.guild.members.cache.get(message.author.id).nickname
        return nick ? nick : message.author.username
    },
    "{user_createdate}": function(bot, message) {
        return message.author.createdAt
    },
    "{user_joindate}": function(bot, message) {
        return new Date(message.guild.members.cache.get(message.author.id).joinedTimestamp)
    },
    "{server_name}": function(bot, message) {
        return message.guild.name
    },
    "{server_id}": function(bot, message) {
        return message.guild.id
    },
    "{server_membercount}": function(bot, message) {
        return message.guild.memberCount
    },
    "{server_rolecount}": function(bot, message) {
        return message.guild.roles.cache.size
    },
    "{server_channelcount}": function(bot, message) {
        return message.guild.channels.cache.size
    },
    "{server_owner}": function(bot, message) {
        return message.guild.owner
    },
    "{server_owner_tag}": function(bot, message) {
        return `${message.guild.owner.user.username}"#${message.guild.owner.user.discriminator}`
    },
    "{server_owner_name}": function(bot, message) {
        return message.guild.owner.user.username
    },
    "{server_owner_id}": function(bot, message) {
        return message.guild.owner.user.id
    },
    "{server_createdate}": function(bot, message) {
        return message.guild.createdAt
    },
    "{message_id}": function(bot, message) {
        return message.id
    },
    "{message_content}": function(bot, message) {
        return message.content
    },
    "{channel}": function(bot, message) {
        return message.channel
    },
    "{channel_name}": function(bot, message) {
        return message.channel.name
    },
    "{channel_createdate}": function(bot, message) {
        return message.channel.createdAt
    },
    "{placeholder}": function(bot, message) {
        return "Dummy"
    },
    "{test_placeholders}": function(bot, message) {
        bot.placeholders.test(bot, message, message.content)
        return "Testing placeholders"
    }

}

module.exports.test = async function(bot, message, msg) {
    let embed = new Discord.MessageEmbed()
    .setAuthor("Server placeholders", bot.user.displayAvatarURL())
    .setColor(bot.config.colors.main)
    for(elem in placeholders) {
        if(elem === "{test_placeholders}") continue
        embed.addField(`${elem}`, await placeholders[elem](bot, message), true)
        //message.channel.send(`${elem}: ${await placeholders[elem](bot, message)}`)
    }
    message.channel.send(embed)
}