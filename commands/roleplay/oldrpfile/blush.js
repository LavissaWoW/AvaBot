module.exports.run = async(bot, message, args) => {
    let blush = bot.acts.blush[bot.random(0, bot.acts.blush.length - 1)]
    let mention = message.mentions.users.first() || bot.users.cache.get(args) || bot.users.cache.find(e => e.username.toLowerCase().includes(args.toLowerCase())) || message.author
    bot.con.query(bot.queries.get_profil,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.con.query(bot.queries.create_profil,[message.author.id])
        profil = profil[0]
        bot.con.query(bot.queries.get_profil,[mention.id],function(err,mention_profil){
            if(!mention_profil || mention_profil.length === 0) return bot.con.query(bot.queries.create_profil,[mention.id])
            mention_profil = mention_profil[0]
            profil.blushed++
            mention_profil.get_blushed++
            bot.con.query(bot.queries.update_blushed,[profil.blushed,profil.user_id])
            bot.con.query(bot.queries.update_get_blushed,[mention_profil.get_blushed,mention_profil.user_id])
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:message.author.username + " is blushing " + (mention.id === message.author.id ? "!" : mention.username + " !"),
                    icon_url:bot.user.displayAvatarURL()
                },
                image:{
                    url:blush
                },
                footer:{
                    text:mention.username + " get blushed " + mention_profil.get_blushed + " times, and " + message.author.username + " blushed others " + profil.blushed + " times."
                } 

            }})

        })

    })

}

module.exports.help = {
    name:"blush111",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Do a blush",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}