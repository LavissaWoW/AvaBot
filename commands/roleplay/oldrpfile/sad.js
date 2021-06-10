module.exports.run = async(bot, message, args) => {
    let sad = bot.acts.sad[bot.random(0, bot.acts.sad.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.saded++
            mention_profil.get_saded++
            bot.con.query(bot.queries.update_saded,[profil.saded,profil.user_id])
            bot.con.query(bot.queries.update_get_saded,[mention_profil.get_saded,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is sading " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:sad
                },
                footer:{
                    text:mention.username + " get saded " + mention_profil.get_saded + " times, and " + message.author.username + " saded others " + profil.saded + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"sad111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just sad",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}