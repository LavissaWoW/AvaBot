module.exports.run = async(bot, message, args) => {
    let type = args
    if(!type) return bot.erreur("You must enter a type !\n\n**__Available type :__**\n\n• `All` - Send in DM and into the channel\n• `DM` - Send the message in DM\n• `#channel` - Send the message in a specific channel",message.channel.id)
    if(type.toLowerCase().match(/(all|dm)/) !== null){
        bot.con.query(bot.queries.update_level_location,[type.toLowerCase(),message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Level location defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"Level location is now `" + type.toLowerCase() + "` !"
        }})
    } else {
        let mention = message.mentions.channels.first()
        if(!mention) return bot.erreur("Undefined type !\n\n**__Available type :__**\n\n• `All` - Send in DM and into the channel\n• `DM` - Send the message in DM\n• `#channel` - Send the message in a specific channel",message.channel.id)
        bot.con.query(bot.queries.update_level_location,[mention.id,message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Level location defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"Level location is now <#" + mention.id + "> !"
        }})
    }

}



module.exports.help = {
    name:"setlevellocation",
    alias: ["sll"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the level up message location",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}