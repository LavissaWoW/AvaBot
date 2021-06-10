module.exports.run = async(bot, message, args) => {
    let feed = bot.acts.feed[bot.random(0, bot.acts.feed.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.feeded++
            mention_profil.get_feeded++
            bot.con.query(bot.queries.update_feeded,[profil.feeded,profil.user_id])
            bot.con.query(bot.queries.update_get_feeded,[mention_profil.get_feeded,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is feeding " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:feed
                },
                footer:{
                    text:mention.username + " get feeded " + mention_profil.get_feeded + " times, and " + message.author.username + " feeded others " + profil.feeded + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"feed111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just feed",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}