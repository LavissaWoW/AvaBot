module.exports.run = async(bot, message, args) => {
    let role = message.mentions.roles.first()
    if(!role) return bot.erreur("You must mention a role !",message.channel.id,true)
    bot.con.query(bot.queries.get_reactions_by_role,[message.guild.id,message.channel.id,role.id],async function(err,result){
        if(!result || result.length === 0) return bot.erreur("No reaction role found !",message.channel.id,true)
        bot.con.query(bot.queries.delete_role_reaction,[message.guild.id,message.channel.id,role.id])
        let to_delete = await message.channel.send({embed:{
            color:bot.config.colors.main,
            description:"Reaction-role removed !"
        }})
        to_delete.delete({timeout:5000})

    })
}


module.exports.help = {
    name:"reaction-remove",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Remove a reaction role !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}