rpc = require ("../roleplay/rpsystem.js")

module.exports.run = async(bot, message, args) => {
    if(!bot.config.gifadd.includes(message.author.id)) return
    // Arg must be a JSON formatted string
    if (args[0] === "{") {
        try {
            var input = JSON.parse(args)
        } catch (err) {
            let msg = {color:bot.config.colors.red,
            author: {
                name: "Improperly formatted RP command",
                icon_url:bot.user.displayAvatarURL()
            },
            description: `\`${err.message}\``,
            footer: {
                text: 'Tip: All words must be surrounded by ", for example "name": "boop".\nType <prefix> help rpnew for more help'
            }
        }
        console.log(msg)
            message.channel.send({embed:msg})
            return
        }
    } else {
        message.channel.send("New RP command has to be a valid JSON object")
        return
    }
    if (!input.name || !input.description || !input.mention || !input.noMention || !input.victimString || !input.perpString) {
        message.channel.send("New RP commands require at minimum the following setup: \n\
            ```js\n\
{\n\
    name: 'name of the command'\n\
    description: 'Description for the help command'\n\
    mention: 'title to print when other users are mentioned'\n\
    noMention: 'title to print when no users are mentioned'\n\
    victimString: 'string with number of times user has been receiver of this | I.e: was kissed {v_num} times'\n\
    perpString: 'string with number of times user has performed the action | I.e kissed others {p_num} times'\n}```")
        return
    }
    
    const name = input.name

    // Command exists, we won't add it again
    if(bot.commands.has(name)) {
        message.channel.send("This command already exists. I can't overwrite the old command.")
        return
    }
    delete input.name

    let cmd = new rpc.RPCommand(name, input)

    cmd.create(bot, input)
}

module.exports.help = {
    name:"rpnew",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Add RP commands. JSON object with the following structure is needed:\n\
    ```js\n\
{\n\
    name: 'name of the command'\n\
    description: 'Description for the help command'\n\
    mention: 'title to print when other users are mentioned'\n\
    noMention: 'title to print when no users are mentioned'\n\
    victimString: 'string with number of times user has been receiver of this | I.e: was kissed {v_num} times'\n\
    perpString: 'string with number of times user has performed the action | I.e kissed others {p_num} times'\n}```",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:true,
    status:true
}