module.exports.run = async(bot, message, args) => {
    let happy = bot.acts.happy[bot.random(0, bot.acts.happy.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.happied++
            mention_profil.get_happied++
            bot.con.query(bot.queries.update_happied,[profil.happied,profil.user_id])
            bot.con.query(bot.queries.update_get_happied,[mention_profil.get_happied,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is happy " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:happy
                },
                footer:{
                    text:mention.username + " get happied " + mention_profil.get_happied + " times, and " + message.author.username + " happied others " + profil.happied + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"happy111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Just happy",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}