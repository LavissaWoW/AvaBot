module.exports.run = async(bot, message, args) => {
    let msg = args
    if(!msg) return bot.erreur("You must enter a message !\n\nYou can use this [embedbuilder](https://embedbuilder.nadekobot.me) to send embeds !",message.channel.id)
    msg = msg.replace("{member}","<@" + message.author.id + ">")
    .replace("{member.name}",message.member.username)
    .replace("{membercount}",message.guild.memberCount)
    .replace("{avatar}",bot.user.displayAvatarURL())
    .replace("{servericon}",(message.guild.iconURL() == null ? "" : message.guild.iconURL()))
    msg = await bot.placeholders.replace(bot, message, msg)
    if(msg.startsWith("{")){
        try {
            embedMsg = JSON.parse(msg)
            if(embedMsg.plainText) {
                var plainText = embedMsg.plainText
            }
            message.channel.send(plainText)
            message.channel.send({embed:embedMsg})
        } catch {
            return bot.erreur("Invalid embed !",message.channel.id)
        }
    } else {
        if(msg.length > 800) return bot.erreur("The message cannot exceed 800 characters !",message.channel.id)
        message.channel.send(msg)
    }
}


module.exports.help = {
    name:"say",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Say something with the bot !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}