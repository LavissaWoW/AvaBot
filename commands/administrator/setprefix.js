module.exports.run = async(bot, message, args) => {
    let prefix = args
    if(!prefix) return bot.erreur("You must enter the new prefix !",message.channel.id)
    if(prefix.length >= 3) return bot.erreur("The prefix cannot exceed 3 characters !",message.channel.id)
    bot.con.query(bot.queries.update_prefix,[prefix,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Prefix defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"The new prefix is `" + prefix + "` !"
    }})
}


module.exports.help = {
    name:"setprefix",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Edit the guild's prefix !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}