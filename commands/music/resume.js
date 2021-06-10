module.exports.run = async(bot, message, args) => {
    let chan = message.guild.member(bot.user).voice.channel
    if(!chan) return bot.erreur("I'm not playing !",message.channel.id)
    let connection = bot.voice.connections.get(message.guild.id)
    if(!connection || !connection.dispatcher) return bot.erreur("I'm not playing !",message.channel.id)
    if(!connection.dispatcher.paused) return bot.erreur("I'm not paused !",message.channel.id)
    connection.dispatcher.resume(true)
    message.channel.send({embed:{
        color:bot.config.colors.main,
        description:"Music resumed !"
    }})
}


module.exports.help = {
    name:"resume",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Resume the music !",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}