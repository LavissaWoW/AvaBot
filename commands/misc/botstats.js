const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("Ava's Information")
        .setFooter(`Bot info requested by ${message.author.tag} | ${message.author.username} | ${message.author.id}`)
        .setDescription("**Ava's status and info!**")
        embed.addField("🤖 Bot name", `My name is **${bot.user.username}**!`, false)
        embed.addField("🧚🏻 Users", `Watching over **${bot.users.cache.size} users**!`, false)
        embed.addField("🌐 Server", `I'm on **${bot.guilds.cache.size} server's**!`, false)
        embed.addField("🇨 Commands", `Ava has **${bot.commands.size} commands**!`, false)
        embed.addField("🇦 Aliases", `Ava has **${bot.commands.map(e => e.help.alias.length).reduce((x,y) => x + y)} aliases**!`, false)
        embed.addField("Some helpful links!", "[Invite me](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot) **|** [Vote](https://top.gg/bot/804424228022648832/vote) **|** [Ava support discord](https://discord.gg/vJSjPEEeGU)")

        message.channel.send(embed)
    }
}



module.exports.help = {
    name:"botstats",
    alias: ["bs", "stats", "bi", "botinfo"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Ava's stats info!",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}
