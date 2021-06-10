module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],async function(err,guild_info){
        if(!guild_info || guild_info.length === 0) return
        guild_info = guild_info[0]
        let ID = args
        if(!ID) return bot.erreur("You must give the message ID !",message.channel.id)
        let msg = await message.channel.messages.fetch(ID).catch(err => {})
        if(!msg) return bot.erreur("Message not found !",message.channel.id)
        guild_info.ticket_message = msg.id
        msg.react("📥")
        bot.con.query(bot.queries.update_ticket_message,[guild_info.ticket_message,message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            description:"Ticket's message defined !"
        }})
    })
}

module.exports.help = {
    name:"setticket",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the new message to open ticket !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}