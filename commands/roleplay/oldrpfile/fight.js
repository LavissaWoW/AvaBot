module.exports.run = async(bot, message, args) => {
    let fight = bot.acts.fight[bot.random(0, bot.acts.fight.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.fighted++
            mention_profil.get_fighted++
            bot.con.query(bot.queries.update_fighted,[profil.fighted,profil.user_id])
            bot.con.query(bot.queries.update_get_fighted,[mention_profil.get_fighted,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is fighting " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:fight
                },
                footer:{
                    text:mention.username + " get fighted " + mention_profil.get_fighted + " times, and " + message.author.username + " fighted others " + profil.fighted + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"fight111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just fight",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}