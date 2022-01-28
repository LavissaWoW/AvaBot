module.exports.run = async(bot, message, args) => {
    if(message.author.id !== message.guild.ownerID) return bot.erreur("This command is reserved to the owner !",message.channel.id)
    if(!args) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    args = args.split(" ")
    let mention = message.mentions.users.first() || bot.users.cache.get(args[0]) || bot.users.cache.find(e => e.username.toLowerCase().includes(args[0].toLowerCase()))
    if(!mention) return bot.erreur("You must enter a username / ID / mention !",message.channel.id)
    bot.con.query(bot.queries.get_level,[mention.id,message.guild.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        bot.con.query(bot.queries.update_level,[0,0,mention.id,message.guild.id])
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
    name:"levelreset",
    alias: ["lreset", "lr"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Reset a user's profil",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}