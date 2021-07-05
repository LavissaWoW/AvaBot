const ytdl = require("ytdl-core")
const Youtube = require("simple-youtube-api")
const date = require("date-and-time")

let youtube = new Youtube("AIzaSyCxJS3m82oyGlE1mo29GnJdzNrsJUvHJnA")


module.exports.run = async(bot, message, args) => {
    try {
        let voiceChannel = message.member.voice.channel
        if(!voiceChannel) return bot.erreur("You must be in a vocal channel !",message.channel.id)
        let link = args
        if(!link) return bot.erreur("You must give something to play !",message.channel.id)   
        if(link.includes("youtube.com")){
            let info = await ytdl.getBasicInfo(link)
            if(!info) return
            let title = info.videoDetails.title,
            channel = info.videoDetails.ownerChannelName,
            duration = Number(info.videoDetails.lengthSeconds) * 1000,
            id = info.videoDetails.videoId,
            otherInfos = await youtube.getVideoByID(id)

            let published = date.format(otherInfos.publishedAt,"DD/MM/YYYY")
            bot.queued({name:title,group:channel,asked:message.author.id,date:published,id:id,duration:duration,start_at:Date.now()},"youtube",voiceChannel.id,message.channel.id)
            message.channel.send({embed:{
                color:bot.config.colors.main,
                description:"`" + title + "` has been queued !"
            }})
        } else {
            const videos = await youtube.searchVideos(link, 5).catch(err => {})
            if(!videos || videos.length === 0) return bot.erreur("Too many requests !",message.channel.id)
            let vidNameArr = videos.map(e => e.title)
            vidNameArr.push('exit');
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author:{
                    name:"Choose something to play !",
                    icon_url:bot.user.displayAvatarURL()
                },
                description:vidNameArr.filter(e => e !== undefined).map((e,i) => "**`#" + (i + 1) + "` ⨠** " + e).join("\n")
            }})
            let filter = m => !isNaN(m.content) && m.author.id === message.author.id
            let collector = message.channel.createMessageCollector(filter,{time:60000})
            let choice = 6
        
            collector.on("collect", msg => {
                choice = Number(msg.content)
                collector.stop()
            })

            collector.on("end",async collected => {
                if(choice === 6) return bot.erreur("Request cancelled !",message.channel.id)
                var video = await youtube.getVideoByID(videos[choice - 1].id);
                let title = video.raw.snippet.title,
                channel = video.raw.snippet.channelTitle,
                duration = bot.convert_duration(video.duration),
                published = date.format(video.publishedAt,"DD/MM/YYYY")
                bot.queued({name:title,group:channel,asked:message.author.id,date:published,id:video.raw.id,duration:duration,start_at:Date.now()},"youtube",voiceChannel.id,message.channel.id)
                message.channel.send({embed:{
                    color:bot.config.colors.main,
                    description:"`" + title + "` has been queued !",
                }})
            })
        }
    } catch(error) {
        console.log(error)
    }
}


module.exports.help = {
    name:"play",
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