const { MessageEmbed } = require("discord.js")
var fs = require('fs')

module.exports.help = {
    name: "addgif",
    alias: [],
    cooldown: 0,
    use_per_cooldown: 1,
    deleted: false,
    description: "Adds a gif to the commands",
    permissions:{
        bot: "",
        user: "",
        role: ""
    },
    developer: false,
    status: true
}

module.exports.run = async(bot, message, args) => {
    console.log(bot.config.gifadd)
    if(!bot.config.gifadd.includes(message.author.id)) {
        message.channel.send("You do not have permission to use this command")
        return 0
    }
    args = args.split(" ")
    fs.readFile(__dirname +'../../../json/actions.json', 'utf-8', function(err, data) {
        if (err) throw err

        var arrayOfObjects = JSON.parse(data)
        arrayOfObjects[args[0]].push(args[1])
        fs.writeFile(__dirname +'../../../json/actions.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
            if (err) throw err
            message.channel.send(`Added ${args[1]} to ${args[0]}!`)
        })
    })
}