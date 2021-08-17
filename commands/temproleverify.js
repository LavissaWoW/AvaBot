let verifyChannel; // Her kan du legge inn channel ID
let unverifiedRole; // Role ID for unverified
let verifiedRole; // Role ID for verified
let verifyMessage; // Verified-meldinga. Kun ett ord!
let started = false;

module.exports.run = async(bot, message, args) => {
    const splitArgs = args.split(" ");

    switch (splitArgs[0]) {
        case "start":
            if (started) return;
            if(!verifiedRole || !verifyMessage) {
                message.channel.send("Please check that verified role and verify message has been set");
                return;
            }
            bot.on("message", async message => {
                if(message.author.bot || !message.guild) return
                if(verifyChannel && message.channel.id !== verifyChannel) return;
                if(message.content.toLowerCase() === verifyMessage) {
                    if (!message.member.roles.cache.find(r => r.id === verifiedRole)) {
                        if(unverifiedRole) message.member.roles.remove(unverifiedRole);
                        message.member.roles.add(verifiedRole);
                        message.channel.send("<@"+message.author.id+"> was verified! Congrats <3");
                    } 
                    //message.delete() // Uncomment me for å slette meldinger med ordet!!
                }
            })
            started = true;
            break;
    
        case "set":
            switch (splitArgs[1]) {
                case "verified":
                    let vRole = message.mentions.roles.first()
                    verifiedRole = vRole.id;
                    message.channel.send({embed:{
                        color: bot.config.colors.main,
                        author: {
                            name: "Verified role set!",
                            icon_url: bot.user.displayAvatarURL()
                        },
                        description: "Verified role has been set to <@&"+verifiedRole+">"
                    }})
                    break;
            
                case "unverified":
                    let uvRole = message.mentions.roles.first()
                    unverifiedRole = uvRole.id;
                    message.channel.send({embed:{
                        color: bot.config.colors.main,
                        author: {
                            name: "Unverified role set!",
                            icon_url: bot.user.displayAvatarURL()
                        },
                        description: "Unverified role has been set to <@&"+unverifiedRole+">"
                    }})
                    break;

                case "message":
                    verifyMessage = splitArgs[2].toLowerCase();
                    message.channel.send({embed:{
                        color: bot.config.colors.main,
                        author: {
                            name: "Verify message set!",
                            icon_url: bot.user.displayAvatarURL()
                        },
                        description: "Verify message has been set to " + verifyMessage
                    }})
                    break;
    
                case "channel":
                    let channel = message.mentions.channels.first();
                    if(!channel) {
                        message.channel.send("You didn't mention a valid channel.");
                        return;
                    }
                    verifyChannel = channel.id;
                    message.channel.send({embed:{
                        color: bot.config.colors.main,
                        author: {
                            name: "Verify channel set!",
                            icon_url: bot.user.displayAvatarURL()
                        },
                        description: "Verify channel has been set to <#" + verifyChannel + ">"
                    }})
                    break;

                default:
                    message.channel.send({embed: {
                        color: bot.config.colors.main,
                        author: {
                            name: "No role set!",
                            icon_url: bot.user.displayAvatarURL()
                        },
                        description: 'Wrong argument to "set": '+splitArgs[1]+'\nPlease use "verified", "unverified", "message", or "channel".' 
                    }})
                    break;
            }
            break;

        case "print":
            message.channel.send({embed:{
                color:bot.config.colors.main,
                author: {
                    name: "Role verify status",
                    icon_url: bot.user.displayAvatarURL()
                },
                fields: [
                    {
                        name: "Unverified role",
                        value: unverifiedRole ? "<@&"+unverifiedRole+">" : "None"
                    },
                    {
                        name: "Verified role",
                        value: verifiedRole ? "<@&"+verifiedRole+">" : "None"
                    },
                    {
                        name: "Verify message",
                        value: verifyMessage ? verifyMessage : "None"
                    },
                    {
                        name: "Verify channel",
                        value: verifyChannel ?  "<#"+verifyChannel+">" : "None"
                    },
                    {
                        name: "Monitoring verification messages",
                        value: started
                    }
                ]
            }})
            break;
        default:
            message.channel.send({embed: {
                color: bot.config.colors.main,
                author: {
                    name: "No role set!",
                    icon_url: bot.user.displayAvatarURL()
                },
                description: 'Wrong argument to "roleverify": '+splitArgs[0]+'\nPlease use "start", "set", or "print".' 
            }})
    break;
    }
}

module.exports.help = {
    name:"roleverify",
    alias: ["rvf"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Temp role stuffs",
    permissions:{
        bot:"",
        user:"",
        role:""
    },
    developer:false,
    status:true
}