module.exports.help = {
    name:"cuddle",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just cuddle",
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
        mentionProfile.cuddled++;
        mentionProfile.get_cuddled++;
        bot.con.query(bot.queries.update_cuddled,[mentionProfile.cuddled, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_cuddled,[mentionProfile.get_cuddled, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "wants cuddles!" : `is cuddleing ${mention.username}!`}`)
        .setImage(bot.acts.cuddle[bot.random(0, bot.acts.cuddle.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} wants cuddles!` : `${mention.tag} got cuddles ${mentionProfile.get_cuddled} times and ${message.author.tag} cuddled others ${mentionProfile.cuddled} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}