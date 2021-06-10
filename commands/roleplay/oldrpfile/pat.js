module.exports.run = async(bot, message, args) => {
    let pat = bot.acts.pat[bot.random(0, bot.acts.pat.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.pated++
            mention_profil.get_pated++
            bot.con.query(bot.queries.update_pated,[profil.pated,profil.user_id])
            bot.con.query(bot.queries.update_get_pated,[mention_profil.get_pated,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is pating " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:pat
                },
                footer:{
                    text:mention.username + " get pated " + mention_profil.get_pated + " times, and " + message.author.username + " pated others " + profil.pated + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"pat111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just pat",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}