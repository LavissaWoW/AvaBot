module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_global_level,[message.author.id],function(err,profil){
        if(!profil || profil.length === 0) return bot.erreur("Profil not found !",message.channel.id)
        profil = profil[0]
        let color = args
        if(!color) return bot.erreur("You must enter an hexadecimal color !",message.channel.id)
        color = color.replace("#","").replace("0x","")
        if(isNaN("0x" + color)) return bot.erreur("Color not found !",message.channel.id)
        if(Number("0x" + color) < 0 || Number("0x" + color) > 16777215) return bot.erreur("Color not found !",message.channel.id)
        profil.color = color
        bot.con.query(bot.queries.update_global_rankcard,[profil.color,profil.background,message.author.id])
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Color defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"New color for rankcard has been defined !"
        }})
        
    })
}


module.exports.help = {
    name:"globalcolor",
    alias: ["gc"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Set your rankcard color !",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}