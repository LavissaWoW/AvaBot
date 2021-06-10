module.exports.run = async(bot, message, args) => {
    let kiss = bot.acts.kiss[bot.random(0, bot.acts.kiss.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.kissed++
            mention_profil.get_kissed++
            bot.con.query(bot.queries.update_kissed,[profil.kissed,profil.user_id])
            bot.con.query(bot.queries.update_get_kissed,[mention_profil.get_kissed,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is kissing " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:kiss
                },
                footer:{
                    text:mention.username + " get kissed " + mention_profil.get_kissed + " times, and " + message.author.username + " kissed others " + profil.kissed + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"kiss111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just kiss",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}