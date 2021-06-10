module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.channels.first()
    if(!mention){
        bot.con.query(bot.queries.update_log_channel,["",message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Log channel defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"There's no more log channel !"
        }})
    }

    if(!["news","text"].includes(mention.type)) return bot.erreur("This is not a text channel !",message.channel.id)
    bot.con.query(bot.queries.update_log_channel,[mention.id,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Log channel defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Log channel is now <#" + mention.id + "> !"
    }})
}


module.exports.help = {
    name:"setlog",
    alias: ["sl"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the log channel !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}