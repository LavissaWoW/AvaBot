module.exports.help = {
    name:"ily",
    alias: ["i_love_you", "i-love-you", "ILY", "iloveyou"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"I love you <3 !",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}

const { MessageEmbed } = require("discord.js")

module.exports.run = async(bot, message, args) => {
    args = args.split(" ");
    let reson = '" ' + args.join(" ") + ' "';
    try {
       //reson = reson.replace(/[0-9]/g, '');
       reson = reson.replace(`<@!${message.mentions.users.first().id}>`, "")
    } catch (err) {}
    if (reson == '"  "') reson = ""
    const username = args.length ? args.join(" ").toLowerCase() : ""
    const mention = message.mentions.users.first() || bot.users.cache.get(args.join(" ")) || bot.users.cache.find(e => e.username.toLowerCase() === username) || message.author;

    bot.con.query(bot.queries.get_profil,[mention.id],function(err, mentionProfile){
        if(!mentionProfile || mentionProfile.length === 0) bot.con.query(bot.queries.create_profil,[mention.id])
        mentionProfile = mentionProfile[0]
        mentionProfile.ilyed++;
        mentionProfile.get_ilyed++;
        bot.con.query(bot.queries.update_ilyed,[mentionProfile.ilyed, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_ilyed,[mentionProfile.get_ilyed, mentionProfile.user_id])


        message.channel.send(`${message.author} sending ${mention} a message!`)  
        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "i love somone <3 " : `i love you  ${mention.username} <3!`}`)
        .setImage(bot.acts.ily[bot.random(0, bot.acts.ily.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} i love someone <3 !` : `${mention.tag} has somone in love <3 ${mentionProfile.get_ilyed} times and ${message.author.tag} is loving others ${mentionProfile.ilyed} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}