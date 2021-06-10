module.exports.help = {
    name:"goodnight",
    alias: ["gn"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Do a good night",
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
        mentionProfile.goodnighted++;
        mentionProfile.get_goodnighted++;
        bot.con.query(bot.queries.update_goodnighted,[mentionProfile.goodnighted, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_goodnighted,[mentionProfile.get_goodnighted, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "say goodnight!" : `say goodnight to ${mention.username}!`}`)
        .setImage(bot.acts.goodnight[bot.random(0, bot.acts.goodnight.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} say goodnight!` : `${mention.tag} got sad goodnight to ${mentionProfile.get_goodnighted} times and ${message.author.tag} sad goodnight to others ${mentionProfile.goodnighted} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}