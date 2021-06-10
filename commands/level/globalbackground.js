const canvacord = require("canvacord")

module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_global_level,[message.author.id],async function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        profil = profil[0]
        let bg = args
        if(!bg) bg = bot.config.images.rankcard_default_background
        if(bg.match(/\.(?:jpe?g|png)$/) === null) return bot.erreur("Invalid image link !",message.channel.id)
        const rank = new canvacord.Rank()
        .setBackground("IMAGE",bg)
        .setAvatar(message.author.displayAvatarURL({format:"png",dynamic:false}))
        .setLevel(1)
        .setCurrentXP(1)
        .setRequiredXP(1)
        .setUsername(message.author.username)
        .setDiscriminator(message.author.discriminator)
        .setRank(1)
        let data = await rank.build().catch(err => {})
        if(!data) return bot.erreur("Invalid image link !",message.channel.id)
        profil.background = bg
        bot.con.query(bot.queries.update_global_rankcard,[profil.color,profil.background,message.author.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Background defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:(args == "" ? "Default background" : "New background") + " for rankcard has been defined !"
        }})
    })
}


module.exports.help = {
    name:"globalbackground",
    alias: ["gb"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Set your rankcard background !",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}