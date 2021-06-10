const date = require("date-and-time")

module.exports.run = async(bot, message, args) => {
    let mention = message.mentions.users.first()
    if(!mention) return bot.erreur("You must mention a member !",message.channel.id)
    let reason = args.split(" ").slice(1).join(" ").trim()
    if(!reason) reason = "No reason specified"
    if(reason.length > 60) return bot.erreur("The reason's length cannot exceed 60 characters !",message.channel.id)
    bot.con.query(bot.queries.warn,[bot.get_id(),mention.username,mention.id,message.guild.id,message.author.username,message.author.id,date.format(new Date(),"DD/MM/YYYY - HH:mm"),reason])
    bot.con.query(bot.queries.get_warn,[mention.id,message.guild.id],function(err,result){
        if(result.length === 0) return
        let embed = {embed:{
            color:bot.config.colors.main,
            author:{
                name:"Warn !",
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
                    name:"Warn count",
                    value:result.length,
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
    })

}


module.exports.help = {
    name:"warn",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Warn a member",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}