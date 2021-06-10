module.exports.run = async(bot, message, args) => {
    let image = args
    if(!image){
        bot.con.query(bot.queries.update_leave_image,["",message.guild.id])
        return message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Leave image defined !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"There's no more leave image !"
        }})
    }

    if(image.match(/\.(?:jpe?g|png)$/) === null) return bot.erreur("This is not an image's link !",message.channel.id)

    bot.con.query(bot.queries.update_leave_image,[image,message.guild.id])
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Leave image defined !",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Leave image is now",
        image:{
            url:image
        }
    }})
}


module.exports.help = {
    name:"setleaveimage",
    alias: ["sli"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Set the leave image !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}