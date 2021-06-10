module.exports.help = {
    name:"sip",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Do a sip",
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
        mentionProfile.bonked++;
        mentionProfile.get_bonked++;
        bot.con.query(bot.queries.update_bonked,[mentionProfile.bonked, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_bonked,[mentionProfile.get_bonked, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "wants a bonk!" : `is bonking ${mention.username}!`}`)
        .setImage(bot.acts.bonk[bot.random(0, bot.acts.bonk.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} wants a bonk!` : `${mention.tag} got bonked ${mentionProfile.get_bonked} times and ${message.author.tag} bonked others ${mentionProfile.bonked} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}