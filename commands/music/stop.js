module.exports.run = async(bot, message, args) => {
    let chan = message.guild.member(bot.user).voice.channel
    if(!chan) return bot.erreur("I'm not playing !",message.channel.id)
    let queue = bot.queue.find(e => e.guild_id === message.guild.id)
    if(queue) bot.queue.splice(bot.queue.indexOf(queue),1)
    if(bot.playing[message.guild.id]) delete bot.playing[message.guild.id]
    chan.leave()
    message.channel.send({embed:{
        color:bot.config.colors.main,
        description:"Music stopped !"
    }})
}



module.exports.help = {
    name:"stop",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Stop playing",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}