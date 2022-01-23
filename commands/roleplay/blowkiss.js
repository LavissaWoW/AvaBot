module.exports.help = {
    name:"oldblowkiss",
    alias: ["blow-kiss", "blow_kiss", "bk", "blow kiss,"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Do a blowkiss",
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
        mentionProfile.bked++;
        mentionProfile.get_bked++;
        bot.con.query(bot.queries.update_bked,[mentionProfile.bked, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_bked,[mentionProfile.get_bked, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "is blowing a kiss!" : `is blowing a kiss to ${mention.username}!`}`)
        .setImage(bot.acts.blowkiss[bot.random(0, bot.acts.blowkiss.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} is blowing a kiss!` : `${mention.tag} got blowed a kiss at ${mentionProfile.get_bked} times and ${message.author.tag} is blowing a kiss others ${mentionProfile.bked} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}