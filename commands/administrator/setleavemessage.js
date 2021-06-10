module.exports.run = async(bot, message, args) => {
    let msg = args
    if(!msg){
        bot.con.query(bot.queries.update_leave_message,["",message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Leave message defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"There's no more leave message !"
        }})
    }

    if(msg.startsWith("{")){
        let valid = await JSON.parse(msg).catch(err => {})
        if(!valid) return bot.erreur("This embed is invalid !",message.channel.id)
    } else {
        if(msg.length > 800) return bot.erreur("The leave message cannot exceed 800 characters !",message.channel.id)
    }

    bot.con.query(bot.queries.update_leave_message,[msg,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Leave message defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Leave message has been defined !"
    }})
}


module.exports.help = {
    name:"setleavemessage",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the leave message !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}