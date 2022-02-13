const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("Vote on me.")
        .setDescription("You can click link under to vote.\nVoting reward and streak system wil be added later on.")
        embed.addField("Vote", "[Click me to vote on me.](https://top.gg/bot/804424228022648832/vote)")

        message.channel.send(embed)
    }
}



module.exports.help = {
    name:"vote",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Vote for Ava!",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}