module.exports.run = async(bot, message, args) => {
    let type = args
    if(!type) return bot.erreur("You must enter a type for level up roles !\n\n**__Available type :__**\n\n• `replace` - replace the older role\n• `stack` - stack every roles",message.channel.id)
    if(type.toLowerCase().match(/(replace|stack)/) == null) return bot.erreur("Invalid type !\n\n**__Available type :__**\n\n• `replace` - replace the older role\n• `stack` - stack every roles",message.channel.id)
    bot.con.query(bot.queries.update_level_type,[type.toLowerCase(),message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Level type defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"The level up role type is now `" + type.toLowerCase() + "` !"
    }})

}



module.exports.help = {
    name:"setleveltype",
    alias: ["slt"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Set the level type for roles",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}