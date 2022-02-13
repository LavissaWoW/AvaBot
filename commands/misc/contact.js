const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("")
        .setDescription("")
        embed.addField("Join our support server if you to cantact devs", "[Support server!](https://discord.gg/vJSjPEEeGU)")

        message.channel.send(embed)
    }
}



module.exports.help = {
    name:"contact",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Contact",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}