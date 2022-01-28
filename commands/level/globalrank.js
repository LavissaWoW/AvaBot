const canvacord = require("canvacord")
const Discord = require("discord.js")

module.exports.run = async(bot, message, args) => {
    if(args === "") args = undefined
    let mention = message.mentions.users.first() || bot.users.cache.get(args) || bot.users.cache.find(e => e.username.toLowerCase().includes(args)) || message.author
    if(!mention) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    bot.con.query(bot.queries.get_global_level,[mention.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        profil = profil[0]
        bot.con.query(bot.queries.get_global_leaderboard,[],async function(err,leaderboard){
            let custom_color = "#" + profil.color
            let custom_background = profil.background
            let rang = leaderboard.findIndex(e => e.user_id === mention.id) + 1
            const rank = new canvacord.Rank()
            .setAvatar(mention.displayAvatarURL({format:"png",dynamic:false}))
            .setCustomStatusColor(custom_color)
            .setLevel(profil.level)
            .setLevelColor(custom_color,custom_color)
            .setRankColor(custom_color,custom_color)
            .setCurrentXP(profil.xp)
            .setRequiredXP(profil.level * 150)
            .setProgressBar(custom_color,"COLOR")
            .setProgressBarTrack(profil.background === bot.config.images.rankcard_default_background ? "#2C2F33" : "TRANSPARENT","COLOR")
            .setUsername(mention.username)
            .setDiscriminator(mention.discriminator)
            .setRank(rang)
            .setBackground("IMAGE",custom_background)
            
            let data = await rank.build()
            const attachment = new Discord.MessageAttachment(data, "RankCard.png");
            message.channel.send(attachment);
        })
    })
}


module.exports.help = {
    name:"globalrank",
    alias: ["gr", "grank"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"See someone's profil",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}