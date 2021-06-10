module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.channels.first()
    if(!mention){
        bot.con.query(bot.queries.update_welcome_channel,["",message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Welcome channel defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"There's no more welcome channel !"
        }})
    }

    if(!["news","text"].includes(mention.type)) return bot.erreur("This is not a text channel !",message.channel.id)
    bot.con.query(bot.queries.update_welcome_channel,[mention.id,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Welcome channel defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Welcome channel is now <#" + mention.id + "> !"
    }})
}


module.exports.help = {
    name:"setwelcomechannel",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the welcome channel !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}