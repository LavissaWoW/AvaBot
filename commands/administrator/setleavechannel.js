module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.channels.first()
    if(!mention){
        bot.con.query(bot.queries.update_leave_channel,["",message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"leave channel defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"There's no more leave channel !"
        }})
    }

    if(!["news","text"].includes(mention.type)) return bot.erreur("This is not a text channel !",message.channel.id)
    bot.con.query(bot.queries.update_leave_channel,[mention.id,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Leave channel defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Leave channel is now <#" + mention.id + "> !"
    }})
}


module.exports.help = {
    name:"setleavechannel",
    alias: ["slc"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the leave channel !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}