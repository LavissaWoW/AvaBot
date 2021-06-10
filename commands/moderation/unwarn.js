module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.users.first()
    if(!mention) return bot.erreur("You must mention a member !",message.channel.id)
    bot.con.query(bot.queries.get_warn,[mention.id,message.guild.id],function(err, warns){
        if(!warns || warns.length === 0) return bot.erreur("This member doesn't have any warn !",message.channel.id)
        let index = args.split(" ").slice(1).join(" ").trim()
        if(!index) return bot.erreur("You must enter a warn index !",message.channel.id)
        index--
        if(!warns[index]) return bot.erreur("Warn not found !",message.channel.id)
        let warn = warns[index]
        bot.con.query(bot.queries.delete_warn,[warn.ID])
        let embed = {embed:{
            color:bot.config.colors.main,
            author:{
                name:"Unwarn !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"<@" + mention.id + ">'s warn number `" + (index + 1) + "` has been deleted !"
        }}
        message.channel.send(embed)

        bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild){
            if(!guild || guild.length === 0) return
            guild = guild[0]
            if(guild.modlog_channel === "") return
            embed.embed.color = bot.config.colors.red
            bot.log(embed,guild.modlog_channel)
        })
    })
}


module.exports.help = {
    name:"unwarn",
    alias: ["remwarn"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Unwarn a member",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}