module.exports.run = async(bot, message, args) => {
    let msg = args
    if(!msg){
        bot.con.query(bot.queries.update_welcome_message,["",message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Welcome message defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"There's no more welcome message !"
        }})
    }

    if(msg.startsWith("{")){
        try {
            JSON.parse(msg)
        } 
        catch {
            return bot.erreur("Invalid embed !",message.channel.id)
        }
    } else {
        if(msg.length > 800) return bot.erreur("The welcome message cannot exceed 800 characters !",message.channel.id)
    }

    bot.con.query(bot.queries.update_welcome_message,[msg,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Welcome message defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Welcome message has been defined !"
    }})
}


module.exports.help = {
    name:"setwelcomemessage",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the welcome message !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}