const ms = require("ms")

module.exports.run = async(bot, message, args) => {
    let role_mention = message.mentions.roles.first()
    if(role_mention){
        if(role_mention.position > message.guild.me.roles.highest.position) return bot.erreur("This role is too high for me !",message.channel.id)
        bot.con.query(bot.queries.update_mute_role,[role_mention.id,message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Muterole defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"Muterole is now <@&" + role_mention.id + ">"
        }})
    }
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,result){
        if(!result || result.length === 0) return
        result = result[0]

        let muterole = message.guild.roles.cache.get(result.mute_role)
        if(!muterole) return bot.erreur("Muterole not found !\n\nUse `ava mute @muterole` to set one !",message.channel.id)       
        let mention = message.mentions.users.first()
        if(!mention) return bot.erreur("You must mention a user !",message.channel.id)
        if(message.guild.member(mention).roles.cache.has(muterole.id)) return bot.erreur("This user is already muted !",message.channel.id)
        if(message.guild.member(mention).roles.highest.position > message.guild.me.roles.highest.position) return bot.erreur("I can't mute this user !",message.channel.id)

        let infos = args.split(" ").slice(1).join(" ").trim()
        if(!infos) return bot.erreur("You must enter a duration or / and a reason !",message.channel.id)
        infos = infos.split(" ")
        let duration = infos[0]
        if(isNaN(ms(duration))){
            duration = undefined
            reason = infos.join(" ")
        } else reason = infos.slice(1).join(" ").trim()
        if(!reason || reason == "") reason = "No reason specified"
        message.guild.member(mention).roles.add(muterole.id)
        if(duration) bot.con.query(bot.queries.mute,[message.guild.id,mention.id,mention.username,muterole.id,reason,ms(duration),message.createdTimestamp])
        let embed = {embed:{
            color:bot.config.colors.main,
            author:{
                name:"Mute !",
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
    })
}


module.exports.help = {
    name:"mute",
    alias: ["tempmute"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Mute or tempmute a member !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}