module.exports.run = async(bot, message, args) => {
    let id = args
    if(!id) return bot.erreur("You must enter a message ID !",message.channel.id)
    bot.con.query(bot.queries.get_message,[id],function(err,msg){
        if(!msg || msg.length === 0) return bot.erreur("This message does not have any reaction role configuration !",message.channel.id)
        msg = msg[0]
        let token = bot.get_id()
        bot.con.query(bot.queries.update_linked,[token,msg.message_id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            description:"This message have been unlinked from others messages !"
        }})
    })

    
}


module.exports.help = {
    name:"unlink",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Unlink a message",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}
