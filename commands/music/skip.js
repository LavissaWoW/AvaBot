module.exports.run = async(bot, message, args) => {
    let queue = bot.queue.find(e => e.guild_id === message.guild.id)
    if(!queue) return bot.erreur("I'm not playing !",message.channel.id)
    if(queue.songs.length === 1) return bot.erreur("Queue is empty !",message.channel.id)
    let connection = bot.voice.connections.get(message.guild.id)
    if(!connection || !connection.dispatcher) return bot.erreur("I'm not playing !",message.channel.id)
    connection.dispatcher.end()
    message.channel.send({embed:{
        color:bot.config.colors.main,
        description:"Music skipped !"
    }})
}



module.exports.help = {
    name:"skip",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Skip the current music !",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}