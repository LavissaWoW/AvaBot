const ytdl = require("ytdl-core")
const Youtube = require("simple-youtube-api")
const date = require("date-and-time")

module.exports.run = async(bot, message, args) => {
    let channel = message.member.voice.channel
    if(!channel) return bot.erreur("You must be in a vocal channel !",message.channel.id)
    await channel.leave()
}


module.exports.help = {
    name:"leave",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Leave the voice channel",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}