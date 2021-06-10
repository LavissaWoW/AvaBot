const ms = require("ms")

module.exports.run = async(bot, message, args) => {
    let infos = args
    if(!infos) return bot.erreur("You must respect this model !\n\n• `ava start (channel) <duration> <winners> <gift>`",message.channel.id)
    infos = infos.replace("  "," ").split(" ")
    let mention = message.mentions.channels.first()
    if(mention && mention.type !== "text") mention = undefined
    
    let duration = (mention ? infos[1] : infos[0])
    if(!duration) return bot.erreur("You must respect this model !\n\n• `ava start (channel) <duration> <winners> <gift>`",message.channel.id)
    duration = duration.replace("j","d")
    if(isNaN(ms(duration))) return bot.erreur("Invalid duration !",message.channel.id)
    if(ms(duration) < 60000) return bot.erreur("The minimu duration is 1 minute !",message.channel.id)

    let winners = (mention ? infos[2] : infos[1])
    if(!winners) return bot.erreur("You must respect this model !\n\n• `ava start (channel) <duration> <winners> <gift>`",message.channel.id)
    if(isNaN(winners) || !Number.isInteger(Number(winners))) return bot.erreur("You must respect this model !\n\n• `ava start (channel) <duration> <winners> <gift>`",message.channel.id)
    if(winners < 1 || winners > 5) return bot.erreur("The winners count must be between 1 and 5 !",message.channel.id)

    let gift = (mention ? infos.slice(3).join(" ") : infos.slice(2).join(" "))
    if(!gift) return bot.erreur("You must respect this model !\n\n• `ava start (channel) <duration> <winners> <gift>`",message.channel.id)
    if(gift.length > 30) return bot.erreur("The gift cannot exceed 30 characters !",message.channel.id)

    if(!mention) mention = message.channel
    
    message.react("✅")
    let msg = await mention.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:gift,
            icon_url:bot.user.displayAvatarURL()
        },
        description:"**Winners :** `" + winners + "`" +
        "\n**Hosted by :** <@" + message.author.id + ">" +
        "\n\n**Duration :** `" + bot.get_time(ms(duration),true) + "`"
    }})

    msg.react("🎉")

    bot.con.query(bot.queries.create_giveaway,[message.guild.id,message.author.id,mention.id,msg.id,winners,ms(duration),Date.now(),gift])
}



module.exports.help = {
    name:"start",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Start a giveaway",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}