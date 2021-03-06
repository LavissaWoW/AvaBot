const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("")
        .setDescription("**In order to grow, wil you help me by invite me to you server?\nYou can find info about me if you do ``ava info``**")
        embed.addField("Invite me!", "[Click me to invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot)")

        message.channel.send(embed)
    }
}



module.exports.help = {
    name:"invite",
    alias: ["inv"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Invite bot to you server",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}
