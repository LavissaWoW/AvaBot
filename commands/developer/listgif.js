const path = require('path');

const { Command } = require(path.resolve(__dirname, '../../command'))

class RmGif extends Command {
    constructor(...args) {
        super(...args);
        this.developer = true;
        this.description = "List GIFs for a roleplay command";
    }

    run(bot, message, args) {
        if(!bot.config.gifadd.includes(message.author.id)) {
            message.channel.send("You do not have permission to use this command")
            return;
        }

        args = args.split(" ")
        if (!args[0]) {
            message.channel.send("I'm sorry, you didn't write the command correctly.\nSyntax: listgif _rpCommand_")
            return;
        }
        let lookupArg = args[0];

        if(args[1] === "nomention") {
            lookupArg = lookupArg+"_nomention"
        }

        fs.readFile(path.resolve(__dirname,'../../json/actions.json'), 'utf-8', function(err, data) {
            if (err) throw new Error(err);

            var parsedActions = JSON.parse(data);
            if(parsedActions[lookupArg] == null) {
                message.channel.send(`I have no GIFs for ${lookupArg}`)
                return;
            }

            message.channel.send(parsedActions[lookupArg])
        })
    }

}

module.exports.init = async(bot, category) => {
    const rmGif = new RmGif("listgif");
    rmGif.help.category = "developer";
    bot.commands.set(rmGif.help.name, rmGif);
}

module.exports.RmGif = RmGif;