module.exports.run = async(bot, message, args) => {
    let infos = args
    if(!infos) return bot.erreur("You must enter 2 messages ID !",message.channel.id)
    infos = infos.split(" ")
    let id1 = infos[0]
    let id2 = infos[1]
    if(!id1 || !id2) return bot.erreur("You must enter 2 messages ID !",message.channel.id)
    bot.con.query(bot.queries.get_message,[message.guild.id,id1],function(err,msg1){
        if(!msg1 || msg1.length === 0) return bot.erreur("First message does not have any reaction role configuration !",message.channel.id)
        msg1 = msg1[0]
        bot.con.query(bot.queries.get_message,[message.guild.id,id2],function(err,msg2){
            if(!msg2 || msg2.length === 0) return bot.erreur("Second message does not have any reaction role configuration !",message.channel.id)
            msg2 = msg2[0]
            if(msg1.linked_key === msg2.linked_key) return bot.erreur("Messages are already linked !",message.channel.id)
            bot.con.query(bot.queries.update_linked,[msg2.linked_key,msg1.message_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                description:"Messages have been linked !"
            }})
            
        })
    })

    
}


module.exports.help = {
    name:"reactionrolelink",
    alias: ["rrl"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Link 2 messages",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}
