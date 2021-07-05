module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.users.first()
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild_config){
        if(!guild_config || guild_config.length === 0) return
        guild_config = guild_config[0]
        if(guild_config.leave_channel === "") return bot.erreur("This server doesn't have any leave channel !",message.channel.id)
        if(guild_config.leave_message.toString("utf8") === "") return bot.erreur("This server doesn't have any leave message !",message.channel.id)
        message.channel.send({embed:{
            color:bot.config.colors.main,
            description:"Simulation done !"
        }})
        let gMember
        if(mention) {
            gMember = message.guild.member(mention.id)
        }
        bot.emit("guildMemberRemove", gMember ? gMember : message.member)
    })
}


module.exports.help = {
    name:"testleave",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Test your leave message !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}