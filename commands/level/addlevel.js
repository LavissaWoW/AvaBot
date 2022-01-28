module.exports.run = async(bot, message, args) => {
    if(!args) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    args = args.split(" ")
    let mention = message.mentions.users.first() || bot.users.cache.get(args[0]) || bot.users.cache.find(e => e.username.toLowerCase().includes(args[0].toLowerCase()))
    if(!mention) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    bot.con.query(bot.queries.get_level,[mention.id,message.guild.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        profil = profil[0]
        let level_add = args[1]
        if(!level_add) return bot.erreur("You must enter the level count !",message.channel.id)
        if(isNaN(level_add) || !Number.isInteger(Number(level_add))) return bot.erreur("Level count is invalid !",message.channel.id)
        if(level_add > 500000) return bot.erreur("Too many level !",message.channel.id)
        profil.level += Number(level_add)
        bot.con.query(bot.queries.update_level,[profil.level,profil.xp,mention.id,message.guild.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Level added !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"<@" + mention.id + "> just received `" + level_add + "` level !"
        }})
    })
}


module.exports.help = {
    name:"addlevel",
    alias: ["alevel", "al", "alvl"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Add level to a user's profil",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}