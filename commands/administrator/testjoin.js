module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild_config){
        if(!guild_config || guild_config.length === 0) return
        guild_config = guild_config[0]
        if(guild_config.welcome_channel === "") return bot.erreur("This server doesn't have any welcome channel !",message.channel.id)
        if(guild_config.welcome_message.toString("utf8") === "") return bot.erreur("This server doesn't have any welcome message !",message.channel.id)
        message.channel.send({embed:{
            color:bot.config.colors.main,
            description:"Simulation done !"
        }})
        bot.emit("guildMemberAdd",message.member)
    })
}


module.exports.help = {
    name:"testjoin",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Test your welcome message !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}