module.exports.help = {
    name:"simp",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"need a simp",
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
        mentionProfile.simped++;
        mentionProfile.get_simped++;
        bot.con.query(bot.queries.update_simped,[mentionProfile.simped, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_simped,[mentionProfile.get_simped, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "i need a simp!" : `asking ${mention.username} to be my simp!`}`)
        .setImage(bot.acts.simp[bot.random(0, bot.acts.simp.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} i need a simp!` : `${mention.tag} got asked to be a simp ${mentionProfile.get_simped} times and ${message.author.tag} asked other to be a simp ${mentionProfile.simped} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}