const Discord = require("discord.js")

module.exports.run = async(bot, message, args) => {
    
    if(!args.length) {
      return message.channel.send("Please Give the Suggestion")
    }
    
    let channel = message.guild.channels.cache.find((x) => (x.name === "suggestion" || x.name === "suggestions"))
    
    
    if(!channel) {
      return message.channel.send("there is no channel with name - suggestions")
    }
                                                    
    
    let embed = new Discord.MessageEmbed()
    .setAuthor("SUGGESTION: " + message.author.tag, message.author.avatarURL())
    .setThumbnail(message.author.avatarURL())
    .setColor("#ff2050")
    .setDescription(args.join(" "))
    .setTimestamp()
    
    
    channel.send(embed).then(m => {
      m.react("✅")
      m.react("❌")
    }).catch(err => {})
    

    
    message.channel.send("Sended Your Suggestion to " + channel).catch(err => {})
    
  }


module.exports.help = {
    name:"suggest",
    alias: [""],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Suggest your suggestion",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    only_for:[],
    developer:false,
    status:true
}