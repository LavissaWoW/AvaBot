module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_guild,[message.guild.id],function(err,result){
        if(!result || result.length === 0) return
        result = result[0]

        let muterole = message.guild.roles.cache.get(result.mute_role)
        if(!muterole) return bot.erreur("Muterole not found !\n\nUse `ava mute @muterole` to define one !",message.channel.id)       
        let mention = message.mentions.users.first()
        if(!mention) return bot.erreur("You must mention a member !",message.channel.id)
        if(!message.guild.member(mention).roles.cache.has(muterole.id)) return bot.erreur("This member is not muted !",message.channel.id)
        message.guild.member(mention).roles.remove(muterole.id)
        let embed = {embed:{
            color:bot.config.colors.main,
            author:{
                name:"Unmute !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"<@" + mention.id + "> has been unmuted by <@" + message.auhor.id + "> !"
        }}
        message.channel.send(embed)
        bot.con.query(bot.queries.get_tempmute,[mention.id,message.guild.id],function(err,muted){
            if(!muted || muted.length === 0) return
            muted.forEach(e => bot.con.query(bot.queries.unmute,[e.user_id,e.guild_id]))
        })

        bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild){
            if(!guild || guild.length === 0) return
            guild = guild[0]
            if(guild.modlog_channel === "") return
            embed.embed.color = bot.config.colors.green
            bot.log(embed,guild.modlog_channel)
        })
    })
}


module.exports.help = {
    name:"unmute",
    alias: ["tempmute"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Unmute a member !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}