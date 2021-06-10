module.exports.help = {
    name:"happy",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"Just happy",
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
        mentionProfile.happied++;
        mentionProfile.get_happied++;
        bot.con.query(bot.queries.update_happied,[mentionProfile.happied, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_happied,[mentionProfile.get_happied, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "is happy!" : `is happy at  ${mention.username}!`}`)
        .setImage(bot.acts.happy[bot.random(0, bot.acts.happy.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} is happy!` : `${mention.tag} got happy ${mentionProfile.get_happied} times and ${message.author.tag} is happy at others ${mentionProfile.happied} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}