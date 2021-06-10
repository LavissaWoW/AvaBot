module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_global_leaderboard,[],function(err,leaderboard){
        //if(!leaderboard || leaderboard.length < 2) return bot.erreur("Leaderboard is not available !",message.channel.id)
        message.channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Global leaderboard !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:leaderboard.slice(0,10).map((e,i) => "`#" + (i + 1) + "` **" + e.user_name.toString("utf8") + "** - `" + e.level + "` *(" + e.xp + ")*" + (e.user_id === message.author.id ? "  👈" : "")).join("\n")
        }})
    })
}


module.exports.help = {
    name:"globalleaderboard",
    alias: ["gleaderboard"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Display 10 highest users !",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}