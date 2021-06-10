module.exports.run = async(bot, message, args) => {
    let glomp = bot.acts.glomp[bot.random(0, bot.acts.glomp.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.glomped++
            mention_profil.get_glomped++
            bot.con.query(bot.queries.update_glomped,[profil.glomped,profil.user_id])
            bot.con.query(bot.queries.update_get_glomped,[mention_profil.get_glomped,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is glomping " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:glomp
                },
                footer:{
                    text:mention.username + " get glomped " + mention_profil.get_glomped + " times, and " + message.author.username + " glomped others " + profil.glomped + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"glomp111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just glomp",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}