module.exports.help = {
    name:"dance",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just dance",
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
        mentionProfile.danced++;
        mentionProfile.get_danced++;
        bot.con.query(bot.queries.update_danced,[mentionProfile.danced, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_danced,[mentionProfile.get_danced, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "is danceing!" : `is danceing at  ${mention.username}!`}`)
        .setImage(bot.acts.dance[bot.random(0, bot.acts.dance.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} is danceing!` : `${mention.tag} got danced with ${mentionProfile.get_danced} times and ${message.author.tag} danceing with others ${mentionProfile.danced} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}