module.exports.help = {
    name:"holdhand",
    alias: ["hold_hands", "hold_hand","hold-hands", "hold-hand","holdhands"," hold hand", "Hold hands"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Just hold hand",
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
        mentionProfile.hold_hand++;
        mentionProfile.get_hold_hand++;
        bot.con.query(bot.queries.update_hold_hand,[mentionProfile.hold_hand, mentionProfile.user_id])
        bot.con.query(bot.queries.update_get_hold_hand,[mentionProfile.get_hold_hand, mentionProfile.user_id])

        let embed = new MessageEmbed()
        .setColor(bot.config.colors.main)
        .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "wants to hold hand!" : `is holding hand with  ${mention.username}!`}`)
        .setImage(bot.acts.hold_hand[bot.random(0, bot.acts.hold_hand.length - 1)])
        .setFooter(mention.id === message.author.id ? `${message.author.username} wants to hold hand!` : `${mention.tag} got hand holded ${mentionProfile.get_hold_hand} times and ${message.author.tag} is holding hands with others ${mentionProfile.hold_hand} times!`)
        .setDescription(`${reson}`)
        message.channel.send(embed)
    })
}