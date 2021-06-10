module.exports.run = async(bot, message, args) => {
    let hold_hand = bot.acts.hold_hand[bot.random(0, bot.acts.hold_hand.length - 1)]
    let mention = message.mentions.users.first() || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.hold_hand++
            mention_profil.get_hold_hand++
            bot.con.query(bot.queries.update_hold_hand,[profil.hold_hand,profil.user_id])
            bot.con.query(bot.queries.update_get_hold_hand,[mention_profil.get_hold_hand,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is hold handing " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:hold_hand
                },
                footer:{
                    text:mention.username + " get hold handed " + mention_profil.get_hold_hand + " times, and " + message.author.username + " hold handed others " + profil.hold_hand + " times."
                }
            }})

        })

    })

}

module.exports.help = {
    name:"holdhand111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just hold_hand",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}