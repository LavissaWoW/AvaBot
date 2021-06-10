module.exports.run = async(bot, message, args) => {
    let cry = bot.acts.cry[bot.random(0, bot.acts.cry.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.cryed++
            mention_profil.get_cryed++
            bot.con.query(bot.queries.update_cryed,[profil.cryed,profil.user_id])
            bot.con.query(bot.queries.update_get_cryed,[mention_profil.get_cryed,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is crying " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:cry
                },
                footer:{
                    text:mention.username + " get cryed " + mention_profil.get_cryed + " times, and " + message.author.username + " cryed others " + profil.cryed + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"cry111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just cry",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}