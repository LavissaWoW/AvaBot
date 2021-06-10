module.exports.run = async(bot, message, args) => {
    let type = args
    if(!type) return bot.erreur("You must enter an option !\n\n**__Available options :__**\n\n• `add`\n• `remove`",message.channel.id)
    let infos = type.split(" ")
    type = infos[0]
    switch(type.toLowerCase()){
        case "add":
            let others = infos.slice(1)
            let role = others.find(e => e.length === 22)
            let level = others[others.indexOf(role) === 0 ? 1 : 0]
            if(!level || isNaN(level)) return bot.erreur("Invalid level !",message.channel.id)
            role = message.mentions.roles.first()
            if(!role) return bot.erreur("You must mention a role !",message.channel.id)
            if(role.position > message.guild.me.roles.highest.position) return bot.erreur("The role must be lower than mine !",message.channel.id,true)
            bot.con.query(bot.queries.get_reward_role,[role.id,message.guild.id],function(err,reward){
                if(reward && reward.length !== 0) return bot.erreur("This role is already a reward !",message.channel.id)
                bot.con.query(bot.queries.create_reward,[message.guild.id,role.id,level])
                message.channel.send({embed:{
                    color:bot.config.colors.main,
                    author:{
                        name:"Reward added !",
                        icon_url:bot.user.displayAvatarURL()
                    },
                    description:"The role <@&" + role.id + "> has been added for the level `" + level + "` !"
                }})
            })
            break;
        case "remove":
            let role_remove = message.mentions.roles.first()
            if(!role_remove) return bot.erreur("You must mention a role !",message.channel.id)
            bot.con.query(bot.queries.get_reward_role,[role_remove.id,message.guild.id],function(err,reward){
                if(!reward || reward.length === 0) return bot.erreur("No reward found for this level !",message.channel.id)
                bot.con.query(bot.queries.delete_reward,[role_remove.id,message.guild.id])
                message.channel.send({embed:{
                    color:bot.config.colors.main,
                    author:{
                        name:"Reward removed !",
                        icon_url:bot.user.displayAvatarURL()
                    },
                    description:"Reward <@&" + role_remove.id + "> for the level `" + reward[0].level + "` has been removed !"
                }})
            })
        
            break;
    }
}


module.exports.help = {
    name:"setlevelreward",
    alias: ["slr"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Add / remove level rewards !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}