const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("")
        .setDescription("")
        embed.addField("Join the support server for help and update!", "[Support server!](https://discord.gg/vJSjPEEeGU)")

        message.channel.send(embed)
    }
}



module.exports.help = {
    name:"discord",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Supports server!",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}