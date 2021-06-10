module.exports.run = async(bot, message, args) => {
    let msg = args
    if(!msg){
        bot.con.query(bot.queries.update_reward_message,[bot.config.default_messages.reward,message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Reward message reset !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"The reward message has been reset"
        }})
    }

    if(msg.startsWith("{")){
        let valid = await JSON.parse(msg).catch(err => {})
        if(!valid) return bot.erreur("This embed is invalid !",message.channel.id)
    } else {
        if(msg.length > 800) return bot.erreur("The reward message cannot exceed 800 characters !",message.channel.id)
    }

    bot.con.query(bot.queries.update_reward_message,[msg,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Reward message defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Reward message has been defined !"
    }})
}



module.exports.help = {
    name:"setrewardmessage",
    alias: ["srm"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the reward message",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}