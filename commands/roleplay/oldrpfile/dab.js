module.exports.run = async(bot, message, args) => {
    let dab = bot.acts.dab[bot.random(0, bot.acts.dab.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.dabed++
            mention_profil.get_dabed++
            bot.con.query(bot.queries.update_dabed,[profil.dabed,profil.user_id])
            bot.con.query(bot.queries.update_get_dabed,[mention_profil.get_dabed,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is dabing " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:dab
                },
                footer:{
                    text:mention.username + " get dabed " + mention_profil.get_dabed + " times, and " + message.author.username + " dabed others " + profil.dabed + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"dab111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just dab",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}