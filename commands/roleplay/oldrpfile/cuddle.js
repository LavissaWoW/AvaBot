module.exports.run = async(bot, message, args) => {
    let cuddle = bot.acts.cuddle[bot.random(0, bot.acts.cuddle.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.cuddled++
            mention_profil.get_cuddled++
            bot.con.query(bot.queries.update_cuddled,[profil.cuddled,profil.user_id])
            bot.con.query(bot.queries.update_get_cuddled,[mention_profil.get_cuddled,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is cuddling " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:cuddle
                },
                footer:{
                    text:mention.username + " get cuddled " + mention_profil.get_cuddled + " times, and " + message.author.username + " cuddled others " + profil.cuddled + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"cuddle111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just cuddle",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}