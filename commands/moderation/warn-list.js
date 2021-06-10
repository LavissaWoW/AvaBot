const date = require("date-and-time")

module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.users.first()
    if(!mention) return bot.erreur("You must mention a member !",message.channel.id)
    bot.con.query(bot.queries.get_warn,[mention.id,message.guild.id],async function(err,warns){
        if(!warns || warns.length === 0) return bot.erreur("This member doesn't have any warn !",message.channel.id)
        let page = 1,
        min = (page - 1) * 5,
        max = page * 5 

        let edit_message = await message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:mention.username + "'s warns !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:warns.slice(min,max).map(e => "**" + (Number(warns.indexOf(e)) + 1) + ".** Moderator : `" + e.moderator_name + "`\n• Date : `" + e.date + "`\n• Reason : `" + e.reason + "`").join("\n\n")
        }})

        if(warns.length <= 5) return

        edit_message.react("⬅️")
        edit_message.react("➡️")
        let embed = edit_message.embeds[0]

        let filter = (reaction,user) => ["⬅️","➡️"].includes(reaction.emoji.name) && user.id === message.author.id
        let collector = edit_message.createReactionCollector(filter,{time:60000})
        
        collector.on("collect",(reaction,reactionCollector) => {
            let reactionEmote = edit_message.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
            reactionEmote.forEach(reaction => reaction.users.remove(message.author.id))

            switch(reaction.emoji.name){
                case "⬅️":
                    if(page === 1) return
                    page--
                    min = (page - 1) * 5
                    max = page * 5 
                    embed.description = warns.slice(min,max).map(e => "**" + (Number(warns.indexOf(e)) + 1) + ".** Moderator : `" + e.moderator_name + "`\n• Date : `" + e.date + "`\n• Reason : `" + e.reason + "`").join("\n\n")
                    break;
                case "➡️":
                    if(page === Math.ceil(warns.length / 5)) return
                    page++
                    min = (page - 1) * 5
                    max = page * 5 
                    embed.description = warns.slice(min,max).map(e => "**" + (Number(warns.indexOf(e)) + 1) + ".** Moderator : `" + e.moderator_name + "`\n• Date : `" + e.date + "`\n• Reason : `" + e.reason + "`").join("\n\n")
                    break;
            }
            edit_message.edit(embed)
        })
    })

}


module.exports.help = {
    name:"warn-list",
    alias: ["warnlist"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"See member's warns",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}