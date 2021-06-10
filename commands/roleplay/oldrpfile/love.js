module.exports.run = async(bot, message, args) => {
    let love = bot.acts.love[bot.random(0, bot.acts.love.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.loved++
            mention_profil.get_loved++
            bot.con.query(bot.queries.update_loved,[profil.loved,profil.user_id])
            bot.con.query(bot.queries.update_get_loved,[mention_profil.get_loved,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is loving " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:love
                },
                footer:{
                    text:mention.username + " get loved " + mention_profil.get_loved + " times, and " + message.author.username + " loved others " + profil.loved + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"love111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just love",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}