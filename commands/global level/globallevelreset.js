module.exports.run = async(bot, message, args) => {
    if(!args) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    args = args.split(" ")
    let mention = message.mentions.users.first() || bot.users.cache.get(args[0]) || bot.users.cache.find(e => e.username.toLowerCase().includes(args[0].toLowerCase()))
    if(!mention) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    bot.con.query(bot.queries.get_global_level,[mention.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        profil = profil[0]
        profil.xp = 0
        profil.level = 0
        bot.con.query(bot.queries.update_global_level,[profil.level,profil.xp,mention.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Profil reset !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"<@" + mention.id + ">'s profil has been reset by <@" + message.author.id + "> !"
        }})
    })
}


module.exports.help = {
    name:"globallevelreset",
    alias: ["glreset"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Reset a global user's profil",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:true,
    status:true
}