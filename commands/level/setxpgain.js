module.exports.run = async(bot, message, args) => {
    let xp = args
    if(!xp) return bot.erreur("You must enter an XP amount between `3` and `100` !",message.channel.id)
    if(isNaN(xp) || !Number.isInteger(Number(xp)) || xp > 100 || xp < 3) return bot.erreur("Invalid XP amount !",message.channel.id)
    bot.con.query(bot.queries.update_xp_gain,[xp,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"XP gain defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"XP gain is now `" + xp + "` XP !"
    }})
}



module.exports.help = {
    name:"setxpgain",
    alias: ["sxg"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the XP gain per message !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}