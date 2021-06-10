module.exports.run = async(bot, message, args) => {
    let dance = bot.acts.dance[bot.random(0, bot.acts.dance.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.danced++
            mention_profil.get_danced++
            bot.con.query(bot.queries.update_danced,[profil.danced,profil.user_id])
            bot.con.query(bot.queries.update_get_danced,[mention_profil.get_danced,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is dancing " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:dance
                },
                footer:{
                    text:mention.username + " get danced " + mention_profil.get_danced + " times, and " + message.author.username + " danced others " + profil.danced + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"dance111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just dance",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}