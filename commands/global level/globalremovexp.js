module.exports.run = async(bot, message, args) => {
    if(!args) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    args = args.split(" ")
    let mention = message.mentions.users.first() || bot.users.cache.get(args[0]) || bot.users.cache.find(e => e.username.toLowerCase().includes(args[0].toLowerCase()))
    if(!mention) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    bot.con.query(bot.queries.get_global_level,[mention.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        profil = profil[0]
        let xp_add = args[1]
        if(!xp_add) return bot.erreur("You must enter the XP count !",message.channel.id)
        if(isNaN(xp_add) || !Number.isInteger(Number(xp_add))) return bot.erreur("XP count is invalid !",message.channel.id)
        if(xp_add > 500000) return bot.erreur("Too many XP !",message.channel.id)
        profil.xp -= Number(xp_add)
        bot.con.query(bot.queries.update_global_level,[profil.level,profil.xp,mention.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"XP removed !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"<@" + mention.id + "> just lost `" + xp_add + "` XP !"
        }})
    })
}


module.exports.help = {
    name:"globalremovexp",
    alias: ["grxp"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Remove XP to a global user's profil",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:true,
    status:true
}