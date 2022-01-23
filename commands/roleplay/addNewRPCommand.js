rpc = require ("./rpSystem.js")

module.exports.run = async(bot, message, args) => {
    if (args[0] === "{") {
        try {
            var input = JSON.parse(args)
        } catch (err) {
            console.error("New RP command was wrongly formatted. Full error:\n", err)
            return
        }
    } else {
        message.channel.send("New RP command has to be a valid JSON object")
        return
    }

    if (!input.name || !input.description || !input.mention || !input.noMention || !input.victimString || !input.perpString) {
        message.channel.send("New RP commands require at minimum the following setup: \n\
            `name: name of the command`\n\
            `description: Description for the help command`\n\
            `mention: title to print when other users are mentioned`\n\
            `noMention: title to print when no users are mentioned`\n\
            `victimString: string with number of times user has been receiver of this | I.e: 'was kissed {v_num} times'`\n\
            `perpString: string with number of times user has performed the action | I.e 'kissed other {p_num} times'`")
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
`name: name of the command`\n\
`description: Description for the help command`\n\
`mention: title to print when other users are mentioned`\n\
`noMention: title to print when no users are mentioned`\n\
`victimString: string with number of times user has been receiver of this | I.e: 'was kissed {v_num} times'`\n\
`perpString: string with number of times user has performed the action | I.e 'kissed other {p_num} times'`",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:true,
    status:true
}