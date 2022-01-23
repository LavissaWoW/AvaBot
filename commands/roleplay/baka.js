module.exports.help = {
    name:"oldbaka",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Do a baka",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}

const { MessageEmbed, Message } = require("discord.js")

module.exports.run = async(bot, message, args) => {
    let users = [], userIDs = [], userMessage = [], printString = ""
    message.mentions.users.forEach(element => {
        users.push(element.username)
        userIDs.push(element.id)
    });
    for (let index = 0; index < users.length; index++) {
        if (index == users.length-1 && users.length > 1) {
            printString = printString+" and "
        }
        printString = printString+users[index]
        if (index < users.length-2) {
            printString = printString+", "
        }
        let user = await bot.db.query(bot.queries.get_profil,[userIDs[index]])
        if(!user || user.length === 0) bot.con.query(bot.queries.create_profil,[userIDs[index]])
        user = user[0]
        console.log(user["bakaed"])
        user.bakaed++;
        user.get_bakaed++;
        bot.db.query(bot.queries.update_bakaed,[user.bakaed, user.user_id])
        bot.db.query(bot.queries.update_get_bakaed,[user.get_bakaed, user.user_id])
        userMessage[index] = users[index] + " got baka " + user.get_bakaed + " times and" + " baka others " + user.bakaed + " times"
    }
    let reson = args
    reson = reson.replaceAll(/<@[\D]?\d+>/g, "")
    if (reson == "") reson = ""
    const username = args.length > 0 ? args.toLowerCase() : ""
    const mention = message.mentions.users.first() || bot.users.cache.get(args) || bot.users.cache.find(e => e.username.toLowerCase() === username) || message.author;

    const ments = users.length > 1 ? users : message.author.username

    let embed = new MessageEmbed()
    .setColor(bot.config.colors.main)
    .setAuthor(`${message.author.username} ${mention.id === message.author.id ? "wants a baka!" : `is baka at ${printString}!`}`)
    .setImage(bot.acts.baka[bot.random(0, bot.acts.baka.length - 1)])
    .setFooter(mention === message.author ? `${message.author.username} wants a baka!` : userMessage.join("\n"))
    .setDescription(`${reson}`)
    message.channel.send(embed)
}