module.exports.help = {
    name:"iil",
    alias: ["im-in-love", "iminlove", "im_in_love"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:true,
    description:"I'm in love <3 !",
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
        mentionProfile.iiled++;
        mentionProfile.get_iiled++;
        bot.con.query(bot.queries.update_iiled,[mentionProfile.iiled, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_iiled,[mentionProfile.get_iiled, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "i'm in love <3 !" : `i'm in love with' ${mention.username} <3 !`}`)
        .setImage(bot.acts.iil[bot.random(0, bot.acts.iil.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} i'm in love <3 !` : `${mention.tag} got  ${mentionProfile.get_iiled} lovers and ${message.author.tag} im in love ${mentionProfile.iiled} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}