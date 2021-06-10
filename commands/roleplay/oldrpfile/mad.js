module.exports.run = async(bot, message, args) => {
    let mad = bot.acts.mad[bot.random(0, bot.acts.mad.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.maded++
            mention_profil.get_maded++
            bot.con.query(bot.queries.update_maded,[profil.maded,profil.user_id])
            bot.con.query(bot.queries.update_get_maded,[mention_profil.get_maded,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is mading " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:mad
                },
                footer:{
                    text:mention.username + " get maded " + mention_profil.get_maded + " times, and " + message.author.username + " maded others " + profil.maded + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"mad111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just mad",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}