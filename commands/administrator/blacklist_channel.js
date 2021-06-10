module.exports.run = async(bot, message, args) => {
    let channels = message.mentions.channels
    if(!channels || channels.length === 0) return bot.erreur("You must mention channels !",message.channel.id)
    channels = channels.array()
    let added = [],removed = []
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild_config){
        if(!guild_config || guild_config.length === 0) return
        guild_config = guild_config[0]
        let blacklist = guild_config.level_blacklist_channels.split(",")
        if(blacklist.length === 1 && blacklist[0] == "") blacklist = []
        channels.forEach(channel => {
            if(blacklist.includes(channel.id)){
                blacklist.splice(blacklist.indexOf(channel.id),1)
                removed.push(channel.id)
            } else {
                blacklist.push(channel.id)
                added.push(channel.id)
            }
        })
        bot.con.query(bot.queries.update_level_blacklist,[blacklist.join(","),message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Level blacklist channels defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Added :",
                    value:added.length == 0 ? "None" : added.map(e => "<#" + e + ">").join("\n"),
                    inline:true
                },
                {
                    name:"Removed :",
                    value:removed.length == 0 ? "None" : removed.map(e => "<#" + e + ">").join("\n"),
                    inline:true
                }
            ]
        }})
    })
}



module.exports.help = {
    name:"blacklist_channel",
    alias: ["blc"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Edit the level blacklist channel !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}