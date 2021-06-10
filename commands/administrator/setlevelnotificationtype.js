module.exports.run = async(bot, message, args) => {
    let type = args
    if(!type) return bot.erreur("You must enter a type for notification !\n\n**__Available type :__**\n\n• `all` - notification for global and server level\n• `global` - notification for global level\n• `server` - notification for server level",message.channel.id)
    if(type.toLowerCase().match(/(all|global|server)/) == null) return bot.erreur("Invalid type !\n\n**__Available type :__**\n\n• `all` - notification for global and server level\n• `global` - notification for global level\n• `server` - notification for server level",message.channel.id)
    bot.con.query(bot.queries.update_level_notiftype,[type.toLowerCase(),message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Level notification type defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"The notification type is now `" + type.toLowerCase() + "` !"
    }})

}



module.exports.help = {
    name:"setlevelnotificationtype",
    alias: ["slnt"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the level notification type !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}