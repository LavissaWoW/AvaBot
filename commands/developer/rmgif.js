const path = require('path');

const { Command } = require(path.resolve(__dirname, '../../command'))

class RmGif extends Command {
    constructor(...args) {
        super(...args);
        this.developer = true;
        this.description = "Remove a GIF from a roleplay command";
    }

    run(bot, message, args) {
        if(!bot.config.gifadd.includes(message.author.id)) {
            message.channel.send("You do not have permission to use this command")
            return;
        }

        args = args.split(" ")
        if (!args[1]) {
            message.channel.send("I'm sorry, you didn't write the command correctly.\nSyntax: rmgif _rpCommand_ _URL_ [_nomention_]")
            return;
        }
        let lookupArg = args[0] + (args[2] ? `_${args[2]}` : "");

        fs.readFile(path.resolve(__dirname,'../../json/actions.json'), 'utf-8', function(err, data) {
            if (err) throw new Error(err);

            var parsedActions = JSON.parse(data);
            if(parsedActions[lookupArg] == null) {
                message.channel.send(`I have no GIFs for ${lookupArg}, so I have nothing to delete.`)
                return;
            }

            let newGifs = []
            for (const gif of parsedActions[args[0]]) {
                if(args[1] !== gif) {
                    newGifs.push(gif);
                }
            }

            parsedActions[lookupArg] = newGifs;

            fs.writeFile(path.resolve(__dirname, '../../json/actions.json'), JSON.stringify(parsedActions, null, 4), 'utf-8', function(err) {
                if (err) throw err
                bot.acts[lookupArg] = newGifs
                message.channel.send(`Removed ${args[1]} from ${lookupArg}!`)
                message.channel.send(`I now have ${bot.acts[lookupArg].length} GIFs for ${lookupArg}`)
            })
            
        })
    }

}

module.exports.init = async(bot, category) => {
    const rmGif = new RmGif("rmgif");
    rmGif.help.category = "developer";
    bot.commands.set(rmGif.help.name, rmGif);
}

module.exports.RmGif = RmGif;