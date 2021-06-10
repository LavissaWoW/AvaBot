module.exports.run = async(bot, message, args) => {
    let slap = bot.acts.slap[bot.random(0, bot.acts.slap.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.slaped++
            mention_profil.get_slaped++
            bot.con.query(bot.queries.update_slaped,[profil.slaped,profil.user_id])
            bot.con.query(bot.queries.update_get_slaped,[mention_profil.get_slaped,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is slapping " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:slap
                },
                footer:{
                    text:mention.username + " get slapped " + mention_profil.get_slaped + " times, and " + message.author.username + " slapped others " + profil.slaped + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"slap111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just slap",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}