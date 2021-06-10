module.exports.run = async(bot, message, args) => {
    let peck = bot.acts.peck[bot.random(0, bot.acts.peck.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.pecked++
            mention_profil.get_pecked++
            bot.con.query(bot.queries.update_pecked,[profil.pecked,profil.user_id])
            bot.con.query(bot.queries.update_get_pecked,[mention_profil.get_pecked,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is pecking " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:peck
                },
                footer:{
                    text:mention.username + " get pecked " + mention_profil.get_pecked + " times, and " + message.author.username + " pecked others " + profil.pecked + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"peck111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just peck",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}