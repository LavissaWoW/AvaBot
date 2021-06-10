const Discord = require("discord.js")

module.exports.run = async(bot, message, args, langue) => {
    let command = args
    if(!command){
        let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor("Help for " + message.author.username)
        .setDescription("Use `ava help {command}` for more information!" + " " + `${bot.commands.size} Commands and ${bot.commands.map(e => e.help.alias.length).reduce((x,y) => x + y)} aliases!`)
        .addField("👥 Roleplay (" + bot.commands.filter(e => e.help.category === "roleplay").size + ") :",
        bot.commands.filter(e => e.help.category === "roleplay").map(e => "`" + e.help.name + "`").join(", "),false)

        .addField("👥 New RP Commands (" + bot.commands.filter(e => e.help.category === "newrp").size + ") :",
        bot.commands.filter(e => e.help.category === "newrp").map(e => "`" + e.help.name + "`").join(", "),false)

        .addField("🆙 Level (" + bot.commands.filter(e => e.help.category === "level").size + ") :",
        bot.commands.filter(e => e.help.category === "level").map(e => "`" + e.help.name + "`").join(", "),false)
        
        .addField("🎉 Giveaway (" + bot.commands.filter(e => e.help.category === "giveaway").size + ") :",
        bot.commands.filter(e => e.help.category === "giveaway").map(e => "`" + e.help.name + "`").join(", "),false)

        .addField("👮 Moderation (" + bot.commands.filter(e => e.help.category === "moderation").size + ") :",
        bot.commands.filter(e => e.help.category === "moderation").map(e => "`" + e.help.name + "`").join(", "),false)

        .addField("🎮 Misc (" + bot.commands.filter(e => e.help.category === "misc").size + ") :",
        bot.commands.filter(e => e.help.category === "misc").map(e => "`" + e.help.name + "`").join(", "),false)

        if(message.member.hasPermission("ADMINISTRATOR")) embed.addField("🛠️ Administrator (" + bot.commands.filter(e => e.help.category === "administrator").size + ") :",
        bot.commands.filter(e => e.help.category === "administrator").map(e => "`" + e.help.name + "`").join(", "),false)
        
        if(message.author.id === "315927854523219968") embed.addField("⭐ Developer (" + bot.commands.filter(e => e.help.category === "developer").size + ") :",
        bot.commands.filter(e => e.help.category === "developer").map(e => "`" + e.help.name + "`").join(", "),false)
        
        embed.addField("Some helpful links!", "[Invite me](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot) **|** [Vote](https://top.gg/bot/804424228022648832/vote) **|** [Ava support discord](https://discord.gg/vJSjPEEeGU)")

        message.channel.send(embed)
    } else {
        let find_command = bot.commands.find(e => (e.help.name.toLowerCase() === command.toLowerCase() || e.help.alias.includes(command.toLowerCase())))
        if(!find_command) return bot.erreur("Command not found !",message.channel.id)
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Help for " + message.author.username,
                icon_url:bot.user.displayAvatarURL()
            },
            description:"Command : `" + find_command.help.name + "`" + 
            "\nAlias : " + (find_command.help.alias.length === 0 ? "..." : find_command.help.alias.map(e => "`" + e + "`").join(", ")) +
            "\nDescription : " + find_command.help.description,
            fields:[
                {
                    name:"Bot's permission",
                    value:"`" + (find_command.help.permissions.user === "" ? "..." : find_command.help.permissions.user) + "`",
                    inline:true
                },
                {
                    name:"User's permission",
                    value:"`" + (find_command.help.permissions.bot === "" ? "..." : find_command.help.permissions.bot) + "`",
                    inline:true
                }
            ]
        }})
    }
}



module.exports.help = {
    name:"help",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"See command list",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}
