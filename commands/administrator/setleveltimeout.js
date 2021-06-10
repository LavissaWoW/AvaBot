const ms = require("ms")

module.exports.run = async(bot, message, args) => {
    let timeout = args
    if(!timeout) return bot.erreur("You must enter a time between `3 seconds` and `2 minutes`",message.channel.id)
    if(isNaN(ms(timeout))) return bot.erreur("Invalid timeout !",message.channel.id)
    if(ms(timeout) < 3000 || ms(timeout) > 120000) return bot.erreur("Invalid timeout !",message.channel.id)
    bot.con.query(bot.queries.update_level_timeout,[ms(timeout),message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Level timeout defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Level message timeout is now `" + bot.get_time(ms(timeout),true) + "` !"
    }})
}



module.exports.help = {
    name:"setleveltimeout",
    alias: ["sltime"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the level message timeout !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}