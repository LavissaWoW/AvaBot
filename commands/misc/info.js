const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("Ava's Info")
        .setDescription("In order to get verified, I need to be on 75+ servers.\nI'm still new at this, so please report bugs if you find them.\n\nAva's Roleplay commands has a counter when you tag another user!\nIt's only made to mention **1** user at the time!")
        embed.addField("Invite", "[Click me to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot)")

        message.channel.send(embed)
    }
}



module.exports.help = {
    name:"info",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Invite Ava to your server",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}
