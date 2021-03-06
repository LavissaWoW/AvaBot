const ytdl = require("ytdl-core")
const Youtube = require("simple-youtube-api")
const date = require("date-and-time")

module.exports.run = async(bot, message, args) => {
    let channel = message.member.voice.channel
    let connection = await channel.join()
    if(!connection) return
    if(!channel) return bot.erreur("You must be in a vocal channel !",message.channel.id)
}


module.exports.help = {
    name:"join",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Play a song",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}