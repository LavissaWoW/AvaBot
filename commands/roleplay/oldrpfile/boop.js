module.exports.run = async(bot, message, args) => {
    let boop = bot.acts.boop[bot.random(0, bot.acts.boop.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.booped++
            mention_profil.get_booped++
            bot.con.query(bot.queries.update_booped,[profil.booped,profil.user_id])
            bot.con.query(bot.queries.update_get_booped,[mention_profil.get_booped,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is booping " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:boop
                },
                footer:{
                    text:mention.username + " get booped " + mention_profil.get_booped + " times, and " + message.author.username + " booped others " + profil.booped + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"boop111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Do a boop",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}