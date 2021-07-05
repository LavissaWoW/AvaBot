module.exports.run = async(bot, message, args) => {
    message.channel.send("This functionality isn't implemented yet. Check back at a later time <3 ")
    return
    let pattern = /(add|edit|delete)\W[^\|]+\|\W?(([^|]{1,}\|?)+)/g

    if(args === "override") {
        overridePreviousError(bot, message)
        return
    }

    delete overrideCache[message.guild.id]

    if (!pattern.test(args)) {
        message.channel.send(bot.locale.unrecognised_command.replace(/{prefix}/g, bot.prefix[0]).replace(/{command}/g, "autoresponder"))
        return
    }
    let splitArgs = args.split("|")
    let actionPattern = /(add|edit|delete)\W([^\|]+)/g
    let actionMatch = actionPattern.exec(splitArgs[0])
    let action = actionMatch[1].trim()
    let userMessage = actionMatch[2].trim()

    if(action === "add") {
        addNewAutoresponse(bot, message, userMessage, splitArgs, message.override, args)
    } else if (action == "edit") {
        editAutoresponse(bot, message, userMessage, splitArgs)
    }
}

module.exports.help = {
    name: "autoresponder",
    alias: ["ar"],
    cooldown: 0,
    user_per_cooldown: 1,
    description: "Configure autoresponses from Ava.\n\
    Syntax: autoresponder|ar [add|edit|delete] message | [m|r] response|reaction ",
    permissions: {
        bot: "",
        user: "ADMINISTRATOR",
        role: ""
    },
    developer: false,
    status: true
}

// Stores rejected messages in case the next command is an override of the erorrs produced.
// Deleted on next valid command.
let overrideCache = {}

/*
 * Adds a new autoresponse based on user input. 
 * Ignores invalid formatted responses
*/
async function addNewAutoresponse(bot, message, userMessage, splitArgs, override, args) {
    // Sent when autoresponse has been saved
    let embed = {
        embed:{
            color: bot.config.colors.green,
            author: {
                name: bot.locale.autoresponse_registered,
                icon_url: bot.user.displayAvatarURL()
            },
            fields: [
                {
                    name: "Command",
                    value: "`" + message.content + "`"
                },
                {
                    name: bot.locale.autoresponse_user_message,
                    value: userMessage
                }
            ]
        }
    }

    // Fetching all guild autoresponses, as duplicates aren't allowed
    bot.con.query(bot.queries.get_guild_autoresponses, [message.guild.id], async function(err, guild_autoresponses) {
        // TODO: Add premium functionality
        // Any server is only allowed to keep 20/50 unique autoresponses
        if(guild_autoresponses.length >= bot.config.max_autoresponses_free) {
            message.channel.send({embed:{
                color: bot.config.colors.red,
                author: {
                    name: bot.locale.autoresponse_limit_reached,
                    icon_url: bot.user.displayAvatarURL()
                },
                fields:[
                    {
                        name: bot.locale.autoresponse_limit_number,
                        value: bot.config.max_autoresponses_free
                    },
                ]
            }})
            return
        }

        let isNew = false, responses = [], reactions = []
        // Fetching a possibly exisitng autoresponse
        bot.con.query(bot.queries.get_autoresponse, [message.guild.id, userMessage], async(err,autoresponse) => {
            if (!autoresponse || autoresponse.length === 0){
                isNew = true
            } else if (!override) {
                message.channel.send({embed: {
                    color: bot.config.colors.red,
                    author: {
                        name: bot.locale.autoresponse_register_abort,
                        icon_url: bot.user.displayAvatarURL()
                    },
                    fields: [
                        {
                            name: bot.locale.reason,
                            value: bot.locale.autoresponse_exists+"\n"+bot.locale.override_command.replace(/{command}/g, "-ar")
                        },
                        {
                            name: bot.locale.warning,
                            value: bot.locale.autoresponse_overwrite_warning
                        }
                    ]
                }})
                overrideCache[message.guild.id] = {message: message, args: args}
                return
            }
            autoresponse = autoresponse[0]

            // Using regex to get all valid arguments
            let responsePattern = /(m|message|msg|r|react|reaction)\W([^\|]+)/
            for (let index = 1; index < splitArgs.length; index++) {
                const element = splitArgs[index];
                if(responsePattern.test(element)) {
                    let match = responsePattern.exec(element)
                    let value = match[2].trim()
                    if(value === "") continue
                    if(match[1][0] === "r") {
                        reactions.push(value)
                    } else if(match[1][0] === "m") {
                        responses.push(value)
                    }
                }
            }

            if(isNew) {
                responses.length > 0 ? responses = responses.join("|") : responses = null
                reactions.length > 0 ? reactions = reactions.join("|") : reactions = null
                bot.con.query(bot.queries.create_autoresponse, [message.channel.guild.id, userMessage, responses, reactions], function(err, ar) {
                    if(err) {
                        message.channel.send(bot.locale.autoresponse_register_new_error)
                        console.log(err)
                    } else {
                        embed.embed.fields.push({
                            name: bot.locale.responses,
                            value: responses ? responses.replace("|", ", ") : bot.locale.none
                        })
                        embed.embed.fields.push({
                            name: bot.locale.reactions,
                            value: reactions ? reactions.replace("|", ", ") : bot.locale.none
                        })
                    }
                    message.channel.send(embed);
                })

            } else {
                let responsesArray = autoresponse.responses ? autoresponse.responses.split("|") : null
                let reactionsArray = autoresponse.reactions ? autoresponse.reactions.split("|") : null

                for (const key in responses) {
                    let element = responses[key];
                    if(!responsesArray.includes(element)) responsesArray.push(element)
                }
                for (const key in reactions) {
                    let element = reactions[key];
                    if(!reactionsArray.includes(element)) reactionsArray.push(element)
                }

                responses.length > 0 ? responses = responses.join("|") : responses = null
                reactions.length > 0 ? reactions = reactions.join("|") : reactions = null

                bot.con.query(bot.queries.update_autoresponse, [userMessage, responses, reactions, autoresponse.id], function(err, ar) {
                    if (err) {
                        message.channel.send(bot.locale.autoresponse_register_new_error)
                        console.log(err)
                    } else {
                        embed.embed.fields.push({
                            name: "Responses",
                            value: responses ? responses.replace("|", ", ") : "None"
                        })
                        embed.embed.fields.push({
                            name: "Reactions",
                            value: reactions ? reactions.replace("|", ", ") : "None"
                        })
                    }
                    message.channel.send(embed);
                })
            }
        })
    })
}

async function editAutoresponse(bot, message, userMessage, splitArgs) {
    bot.con.query(bot.queries.get_autoresponse, [message.guild.id, userMessage], async(err,autoresponse) => {
        if(!autoresponse||autoresponse.length == 0) {
            message.channel.send("I'm sorry, the autoresponse trigger `" + userMessage + "` doesn't exist")
        }
        autoresponse = autoresponse[0]
        let responses = autoresponse.responses.split("|")
        let reactions = autoresponse.reactions.split("|")
    })
}

/*
 * Prepares to override the previous error produced by the autoresponder
 * This is guild specific.
*/

async function overridePreviousError(bot, message) {
    let oldMessage = overrideCache[message.guild.id]

    if(!oldMessage) return

    oldMessage.message.override = true

    if(oldMessage.message.confirm_override === false) {
        oldMessage.message.confirm_override = true
        bot.commands.get('autoresponder').run(bot, oldMessage.message, oldMessage.args)

        delete overrideCache[message.guild.id]
    } else {
        message.channel.send({embed:{
            color: bot.config.colors.main,
            author: {
                name: bot.locale.autoresponse_confirm_override_title,
                icon_url: bot.user.displayAvatarURL()
            },
            fields: [
                {
                    name: bot.locale.warning,
                    value: bot.locale.autoresponse_overwrite_warning + "\n" + bot.locale.override_command_confirmation.replace(/{command}/g, "-ar")
                }
            ]
        }})
        oldMessage.message.confirm_override = false
    }
}

module.exports.send = async(bot, message, response) => {

}

let actions = {
    "{dm}": async function(message, response) {
        let dm = message.author.createDM().catch(err=>{})
        if(dm) {
            dm.send(response)
        }
    },
    "{sendtochannel}": null,

}