module.exports.run = async(bot, message, args) => {
    let kill = bot.acts.kill[bot.random(0, bot.acts.kill.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.killed++
            mention_profil.get_killed++
            bot.con.query(bot.queries.update_killed,[profil.killed,profil.user_id])
            bot.con.query(bot.queries.update_get_killed,[mention_profil.get_killed,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is killing " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:kill
                },
                footer:{
                    text:mention.username + " get killed " + mention_profil.get_killed + " times, and " + message.author.username + " killed others " + profil.killed + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"kill111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just kill",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}