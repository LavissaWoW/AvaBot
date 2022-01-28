module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],async function(err,guild_info){
        if(!guild_info || guild_info.length === 0) return
        guild_info = guild_info[0]
        let ID = args
        if(!ID) return bot.erreur("You must enter a category ID !",message.channel.id)
        let category = message.guild.channels.cache.get(ID)
        if(!category) return bot.erreur("Category not found !",message.channel.id)
        if(category.type !== "category") return bot.erreur("This channel is not a category !",message.channel.id)
        guild_info.ticket_category = category.id
        bot.con.query(bot.queries.update_ticket_category,[guild_info.ticket_category,message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            description:"Ticket's category defined !"
        }}).then(msg => msg.delete({timeout:3000}))
    })
}

module.exports.help = {
    name:"setticketcategory",
    alias: ["stc"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the new category for tickets !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}