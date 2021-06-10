const ms = require("ms")

module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.users.first()
    if(!mention) return bot.erreur("You must mention a member !",message.channel.id)
    if(mention.id === message.author.id) return bot.erreur("I can't ban this member !",message.channel.id)
    if(!message.guild.member(mention).bannable) return bot.erreur("I can't ban this member !",message.channel.id)
    let infos = args.split(" ").slice(1).join(" ").trim()
    if(!infos) return bot.erreur("You must enter a duration or / and a reason !",message.channel.id)
    infos = infos.split(" ")
    let duration = infos[0]
    if(isNaN(ms(duration))){
        duration = undefined
        reason = infos.join(" ")
    } else reason = infos.slice(1).join(" ").trim()
    if(!reason || reason == "") reason = "No reason specified"
    message.guild.member(mention).ban({reason:"[" + message.author.username + "] " + reason + (duration ? " - " + bot.get_time(ms(duration)) : "")})
    if(duration) bot.con.query(bot.queries.ban,[message.guild.id,mention.id,mention.username,reason,ms(duration),message.createdTimestamp])
    let embed = {embed:{
        color:bot.config.colors.main,
        author:{
            name:"Ban !",
            icon_url:bot.user.displayAvatarURL()
        },
        fields:[
            {
                name:"Username",
                value:mention.username,
                inline:true                   
            },
            {
                name:"ID",
                value:mention.id,
                inline:true
            },
            {
                name:"Duration",
                value:(duration ? bot.get_time(ms(duration)) : "Infinity"),
                inline:true
            },
            {
                name:"Moderator",
                value:message.author.username,
                inline:true
            },
            {
                name:"Reason",
                value:reason,
                inline:true
            }
        ]    
    }}
    message.channel.send(embed)

    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.modlog_channel === "") return
        embed.embed.color = bot.config.colors.red
        bot.log(embed,guild.modlog_channel)
    })
}


module.exports.help = {
    name:"ban",
    alias: ["tempban"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Ban or tempban a member !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}