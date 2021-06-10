module.exports.run = async(bot, message, args) => {
    let type = args
    if(!type) return bot.erreur("You must enter a type !\n\n**__Available type :__**\n\n• `All` - Send notification every level\n• `every *number*` - Send notification every *number* level(s)\n• `reward` - Send Notification when there is reward\n• `none` - Don't send notification",message.channel.id)
    if(type.toLowerCase().match(/(all|reward|none)/)){
        bot.con.query(bot.queries.update_level_notification,[type.toLowerCase(),message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Level notification defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"Level notification is now `" + type.toLowerCase() + "` !"
        }})
    } else {
        let infos = type.split(" ")
        if(infos[0].toLowerCase() !== "every") return bot.erreur("Undefined type !\n\n**__Available type :__**\n\n• `All` - Send notification every level\n• `every *number*` - Send notification every *number* level(s)\n• `reward` - Send Notification when there is reward\n• `none` - Don't send notification",message.channel.id)
        let nbr = infos[1]
        if(!nbr) return bot.erreur("You must enter a level !",message.channel.id)
        if(!Number.isInteger(Number(nbr))) return bot.erreur("Invalid level !",message.channel.id)
        if(nbr <= 0 || nbr >= 10000) return bot.erreur("Invalid level !",message.channel.id)
        bot.con.query(bot.queries.update_level_notification,["every " + nbr,message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Level notification defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"Level notification is now every `" + nbr + "` levels !"
        }})
    }
}



module.exports.help = {
    name:"setlevelnotification",
    alias: ["sln"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the level up message notification",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}