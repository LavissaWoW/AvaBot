module.exports.run = async(bot, message, args) => {
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],async function(err,result){
        if(!result || result.length === 0) return

        let ID = args
        if(!ID) return bot.erreur("You must enter a member ID !",message.channel.id)
        let is_ban = await message.guild.fetchBan(ID).catch(err => {})
        if(!is_ban) return bot.erreur("This member is not banned !",message.channel.id)
        message.guild.members.unban(ID)
        let embed = {embed:{
            color:bot.config.colors.main,
            author:{
                name:"Unban !",
                icon_url:bot.user.displayAvatarURL()
            },
            description:"<@" + ID + "> has been unbanned by <@" + message.author.id
        }}
        message.channel.send(embed)
    
        bot.con.query(bot.queries.get_tempmute,[ID,message.guild.id],function(err,banned){
            if(!banned || banned.length === 0) return
            banned.forEach(e => bot.con.query(bot.queries.unban,[e.user_id,e.guild_id]))
        })

        bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild){
            if(!guild || guild.length === 0) return
            guild = guild[0]
            if(guild.modlog_channel === "") return
            embed.embed.color = bot.config.colors.green
            bot.log(embed,guild.modlog_channel)
        })
    })
}


module.exports.help = {
    name:"unban",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Unban a member !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}
