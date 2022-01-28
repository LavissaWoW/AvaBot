const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("Ava's Info")
        .setDescription("I'm a cute bot thet can do a lots of things, but cus im still being made so isnt all stuff done yet :3\n\nI do have.\n**Levling system**\n**Global levling system**\n**Basic moderation system**\n**97 Roleplay commands**\n**Rolereaction system**\n**Giveaway**\n**Stats commands**\n**Ticket system**\n**Welcome message and leave message**\n\nThings so are planed.\nRevamp of\n**Levling system**\n**Roleplay commands**\n**Giveaway**\n\nGeting added\n**Auroresponder**\n**Automoderation**\n**levling system on roleplay commands**\n**Economy**\n**Games/Daily's**\n**Premium**\n**And a loot more**\nYor can go to the support server to suggest new stuff for ava!\n\nIn order to get verified, I need to be on more servers.\nI'm still new at this, so please report bugs if you find them.\n\nAva's Roleplay commands has a counter when you tag another user!\nIt's only made to mention **1** user at the time!")
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
