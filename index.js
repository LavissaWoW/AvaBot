const { notDeepEqual } = require("assert");
const levellingSystem = require("./levelling-system.js");

const Discord = require("discord.js"),
bot = new Discord.Client(/*{ws: { intents: Discord.Intents.ALL }}*/),
fs = require("fs"),
ms = require("ms"),
mysql = require("mysql"),
ytdl = require("ytdl-core")

let config = JSON.parse(fs.readFileSync("./json/config.json","utf8")),
locale = JSON.parse(fs.readFileSync("./json/message.json","utf8")),
queries = JSON.parse(fs.readFileSync("./json/queries.json","utf8")),
acts = JSON.parse(fs.readFileSync("./json/actions.json","utf8")),
env = JSON.parse(fs.readFileSync("json/env.json", "utf8"))

let ph = require("./placeholders.js")

let streamOptions = {seek :0, volume : 1}

bot.commands = new Discord.Collection();
bot.config = config
bot.queries = queries
bot.acts = acts
bot.cooldown = []
bot.prefix = config.prefix
bot.locale = locale
bot.placeholders = ph

bot.erreur = erreur
bot.random = random
bot.get_time = get_time
bot.convert = convert
bot.remove_cooldown = remove_cooldown
bot.queued = queued
bot.playQueue = playQueue
bot.convert_duration = convert_duration
bot.get_id = get_id
bot.log = log

bot.playing = {}
bot.queue = []
bot.reaction_menu = []

let dbCon = JSON.parse(fs.readFileSync("json/database.json", "utf8"))

bot.con = mysql.createConnection(dbCon.ava);

bot.con.connect(function(err) {
    if(err) return console.log(err);
    setTimeout(() => console.log("\x1b[32m[START]\x1b[33m MYSQL is connected !\x1b[0m"), 2000);
});

fs.readdir("./commands/", (err, folders) => {
    // Parsing all folders in command dir
    folders.forEach(folder => {
        // Reading all file names in "folder"
        fs.readdir("./commands/" + folder, (err, files) => {
            // Err signifies that "folder" is not a directory, but a file. So it is parsed
            if(err){
                // Ensures we're reading a JS file
                if(folder.endsWith(".js")){
                    let properties = require("./commands/" + folder)
                    console.log("\x1b[32m[VALID]\x1b[33m Starter : " + folder)

                    // Command is converted to a Class based system, and is initiated differently
                    if(properties.init) {
                            return properties.init(bot, "")
                    }
                    // Command is initiated using the old system
                    properties.help.category = ""
                    return bot.commands.set(properties.help.name,properties)
                } else {
                    return console.log(folder + " is not a directory or a command !")
                }
            }
            let jsfile = files.filter(f => f.split(".").pop() === "js")
            if(jsfile.length <= 0) return console.log("No command found!");
            jsfile.forEach((f, i) => {
                let props = require(`./commands/` + folder + "/" + f);
                console.log("\x1b[32m[VALID]\x1b[33m Starter : " + f + " (" + folder + ")");
                // Command is converted to a Class based system, and is initiated differently
                if(props.init) {
                    return props.init(bot, folder)
                }
                props.help.category = folder
                bot.commands.set(props.help.name, props);
            });
        })
    })
});
bot.login(env.token)

let count = 0
bot.on('ready', async function(){
    console.log("\x1b[32m[START]\x1b[33m Ava is connected !\x1b[0m")
    console.log(`${bot.user.username} is on ${bot.guilds.cache.size} servers and monitoring ${bot.users.cache.size} users! ${bot.commands.size} commands and ${bot.commands.map(e => e.help.alias.length).reduce((x,y) => x + y)} aliases`)
    setInterval(() => {
        if(count === 0) bot.user.setActivity(`ava help | For command list! | Vote for Ava to help her grow!`, {type: "PLAYING"}), count++
        else if(count === 1) bot.user.setActivity(`${bot.guilds.cache.size} servers and ${bot.users.cache.size} users!`, {type: "WATCHING"}), count++
        else if(count === 2) bot.user.setActivity(`with ${bot.commands.size} commands and ${bot.commands.map(e => e.help.alias.length).reduce((x,y) => x + y)} aliases!`, {type: "WATCHING"}), count = 0
    },10000)

    setInterval(() => updateGiveaway(),30000)
    setInterval(() => updateModeration(), 60000);
})

class Database {
    constructor(env) {
        this.db = null;
        if(env === "test") {
            this.initialise("ame")
        } else if (env === "prod") {
            this.initialise("ava")
        }
    }

    initialise(dbName) {
        this.createConnection(dbName);
    }

    async createConnection(dbName) {
        this.db = mysql.createPool(dbCon[dbName]);
    }

    getState() {
        return this.db.state;
    }

    async query(sqlQuery, bindings = []) {
        if (this.db.state === "disconnected") {
            throw new MySqlError("Not connected to a database");
        }

        return await new Promise((resolve, reject) => {
            this.db.query(sqlQuery, bindings, (error, results) => (error ? reject(error) : resolve(results)));
        })
    }
}

bot.db = new Database(dbCon.env);

/*bot.on("message", async message => {
    try {
        if(message.author.bot || !message.guild) return

        // Fetching guild config
        let guildConfig = await bot.db.query(bot.queries.get_guild_config, [message.guild.id]);
        if(!guildConfig || guildConfig.length === 0) {
            await bot.db.query(bot.queries.create_guild_config,[message.guild.id,bot.config.default_messages.level_up,bot.config.default_messages.reward])
            guildConfig = await bot.db.query(bot.queries.get_guild_config, [message.guild.id]);
        }

        // Checks if user has profile
        let user_exists = await bot.db.query(bot.queries.get_profile, [message.author.id]);
        if(!user_exists || user_exists.length === 0) {
            await bot.db.query(bot.queries.create_profile, [message.author.id]);        
        }

        // Fetching user levels
        let user_global_level = await bot.db.query(bot.queries.get_global_level,[message.author.id]);
        if (!user_global_level || user_global_level.length == 0) {
            await bot.db.query(bot.queries.create_global_level, [message.author.id,message.author.username]);
            user_global_level = await bot.db.query(bot.queries.get_global_level,[message.author.id]);
        }
        let user_guild_level = await bot.db.query(bot.queries.get_level, [message.author.id,message.guild.id]);
        if (!user_guild_level || user_guild_level.length == 0) {
            await bot.db.query(bot.queries.create_guild_level,[message.author.id,message.guild.id]);
            user_guild_level = await bot.db.query(bot.queries.get_level, [message.author.id,message.guild.id]);
        }

        guildConfig = guildConfig[0];
        user_global_level = user_global_level[0];
        user_guild_level = user_guild_level[0];
        // Running XP system if message is valid for XP gain
        if(message.content.length > 10 && !guildConfig.level_blacklist_channels.split(",").includes(message.channel.id)) {
            const levels = new levellingSystem.levels(bot, message);
            levels.setUserLevelInfo(user_global_level, user_guild_level);
            levels.setGuildConfig(guildConfig);
            levels.applyGlobalXP();
            levels.applyGuildXP();

            let roles = await query(bot.queries.get_level_reward,[user_guild_level.level,message.guild.id]);
            let rewards = roles.map(e => e.role_id)
            if(rewards.length > 0) rewards.forEach(r => {
                let role_guild = message.guild.roles.cache.get(r)
                if(role_guild) message.member.roles.add(role_guild.id)
                if(guildConfig.level_type === "replace"){
                    bot.con.query(bot.queries.get_fewer_reward,[profil_guild.level,message.guild.id],function(err,fewer_roles){
                        if(fewer_roles && fewer_roles.length === 1){
                            let role_remove = message.guild.roles.cache.get(fewer_roles[0].role_id)
                            if(role_remove && message.member.roles.cache.has(role_remove.id)) message.member.roles.remove(role_remove.id)
                        }
                    })
                }
            })

            if(["server","all"].includes(guildConfig.level_notification_type)){
                let nbr = ["all","reward"].includes(guildConfig.level_notification) ? 1 : guildConfig.level_notification.split(" ")[1]
                let reward = guildConfig.level_notification == "reward" ? rewards.length > 0 : true
                if(Number.isInteger(Number(profil_guild.level) / nbr) && reward){
                    if(["all","dms"].includes(guildConfig.level_location)){
                        let to_dm_guild = await message.author.createDM().catch(err => {})
                        if(to_dm_guild){
                            guildConfig.level_message = guildConfig.level_message.toString("utf8")
                            .replace(/{level}/g,profil_guild.level)
                            .replace(/{xp}/g,profil_guild.xp)
                            .replace(/{member}/g,"<@" + message.author.id + ">")
                            .replace(/{member.name}/g,message.author.username)
                            .replace(/{neededxp}/g,(profil_guild.level * 150 - profil_guild.xp))
                            .replace(/{servericon}/g,message.guild.iconURL({format:"png"}))
                            .replace(/{avatar}/g,message.author.displayAvatarURL({format:"png"}))
                            guildConfig.reward_message = guildConfig.reward_message.toString("utf8")
                            .replace(/{reward}/g,rewards.length == 0 ? "" : rewards.map(e => "<@&" + e + ">").join(", "))
                            if(guildConfig.level_message.startsWith("{")) to_dm_guild.send({embed:JSON.parse(guildConfig.level_message)})
                            else to_dm_guild.send(guildConfig.level_message + (guildConfig.reward_message.startsWith("{") ? "" : guildConfig.reward_message))
                            if(guildConfig.reward_message.startsWith("{")) to_dm_guild.send({embed:JSON.parse(guildConfig.reward_message)})
                        }
                    }
                }
            }
        }
    } catch(error) {
        console.log(error);
    }
})*/


bot.on("message", async message => {
    try {
    if(message.author.bot || !message.guild) return

    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild_config){
        if(!guild_config || guild_config.length === 0) return bot.con.query(bot.queries.create_guild_config,[message.guild.id,"","","","","","","","","","","",bot.config.default_messages.level_up,bot.config.default_messages.reward,""])
        guild_config = guild_config[0]
        bot.prefix = [bot.config.prefix, guild_config.prefix]

        bot.con.query(bot.queries.get_profil,[message.author.id],function(err,exist){
            if(!exist || exist.length === 0) bot.con.query(bot.queries.create_profil,[message.author.id])
            bot.con.query(bot.queries.get_global_level,[message.author.id],function(err,profil_global){
                if(!profil_global || profil_global.length === 0) return bot.con.query(bot.queries.create_global_level,[message.author.id,message.author.username])
                bot.con.query(bot.queries.get_level,[message.author.id,message.guild.id],async function(err,profil_guild){
                    if(!profil_guild || profil_guild.length === 0) return bot.con.query(bot.queries.create_guild_level,[message.author.id,message.guild.id])
                    profil_global = profil_global[0]
                    profil_guild = profil_guild[0]

                    //################################################\\
                    //###################GLOBAL XP####################\\
                    //################################################\\
                    if(message.content.length >= 10){
                        let xp_win = 5
                        profil_global.xp += xp_win
						bot.con.query(bot.queries.update_global_level,[profil_global.level,profil_global.xp,message.author.id])

                        if(profil_global.xp >= profil_global.level * 150){
                            profil_global.xp = profil_global.xp % (profil_global.level * 150)
                            profil_global.level++

                            bot.con.query(bot.queries.update_global_level,[profil_global.level,profil_global.xp,message.author.id])
                            /*
                            if(["global","all"].includes(guild_config.level_notification_type)){
                                if(guild_config.level_notification == "all" || guild_config.level_notification.includes("every")){
                                    let nbr = guild_config.level_notification == "all" ? 1 : guild_config.level_notification.split(" ")[1]
                                    if(Number.isInteger(Number(profil_global.level) / nbr)){
                                        if(["all","dms"].includes(guild_config.level_location)){
                                            let to_dm_global = await message.author.createDM().catch(err => {})
                                            if(to_dm_global) to_dm_global.send({embed:{
                                                color:bot.config.colors.main,
                                                author:{
                                                    name:"Congratulations !",
                                                    icon_url:bot.user.displayAvatarURL()
                                                },
                                                description:"You now have a global level of `" + profil_global.level + "` !"
                                            }})
                                        }
                                    }
                                }
                            }*/   
                        }
                    }

                    //################################################\\
                    //###################GUILD XP#####################\\
                    //################################################\\

                    if(message.content.length >= 10 && !guild_config.level_blacklist_channels.split(",").includes(message.channel.id)){
                        let xp_win = guild_config.level_xp_gain
                        profil_guild.xp += xp_win
						bot.con.query(bot.queries.update_level,[profil_guild.level,profil_guild.xp,message.author.id,message.guild.id])
                        if(profil_guild.xp >= profil_guild.level * 150){
                            profil_guild.xp = profil_guild.xp % (profil_guild.level * 150)
                            profil_guild.level++

                            bot.con.query(bot.queries.update_level,[profil_guild.level,profil_guild.xp,message.author.id,message.guild.id])
                            bot.con.query(bot.queries.get_level_reward,[profil_guild.level,message.guild.id],async function(err,roles){
                                let rewards = roles.map(e => e.role_id)
                                if(rewards.length > 0) rewards.forEach(r => {
                                    let role_guild = message.guild.roles.cache.get(r)
                                    if(role_guild) message.member.roles.add(role_guild.id)
                                    if(guild_config.level_type === "replace"){
                                        bot.con.query(bot.queries.get_fewer_reward,[profil_guild.level,message.guild.id],function(err,fewer_roles){
                                            if(fewer_roles && fewer_roles.length === 1){
                                                let role_remove = message.guild.roles.cache.get(fewer_roles[0].role_id)
                                                if(role_remove && message.member.roles.cache.has(role_remove.id)) message.member.roles.remove(role_remove.id)
                                            }
                                        })
                                    }
                                })

                                if(["server","all"].includes(guild_config.level_notification_type)){
                                    let nbr = ["all","reward"].includes(guild_config.level_notification) ? 1 : guild_config.level_notification.split(" ")[1]
                                    let reward = guild_config.level_notification == "reward" ? rewards.length > 0 : true
                                    if(Number.isInteger(Number(profil_guild.level) / nbr) && reward){
                                        if(["all","dms"].includes(guild_config.level_location)){
                                            let to_dm_guild = await message.author.createDM().catch(err => {})
                                            if(to_dm_guild){
                                                guild_config.level_message = guild_config.level_message.toString("utf8")
                                                .replace(/{level}/g,profil_guild.level)
                                                .replace(/{xp}/g,profil_guild.xp)
                                                .replace(/{member}/g,"<@" + message.author.id + ">")
                                                .replace(/{member.name}/g,message.author.username)
                                                .replace(/{neededxp}/g,(profil_guild.level * 150 - profil_guild.xp))
                                                .replace(/{servericon}/g,message.guild.iconURL({format:"png"}))
                                                .replace(/{avatar}/g,message.author.displayAvatarURL({format:"png"}))
                                                guild_config.reward_message = guild_config.reward_message.toString("utf8")
                                                .replace(/{reward}/g,rewards.length == 0 ? "" : rewards.map(e => "<@&" + e + ">").join(", "))
                                                if(guild_config.level_message.startsWith("{")) to_dm_guild.send({embed:JSON.parse(guild_config.level_message)})
                                                else to_dm_guild.send(guild_config.level_message + (guild_config.reward_message.startsWith("{") ? "" : guild_config.reward_message))
                                                if(guild_config.reward_message.startsWith("{")) to_dm_guild.send({embed:JSON.parse(guild_config.reward_message)})
                                            }
                                        }
                                    }
                                }
                            })
                        }

                    }
/*
                    bot.con.query(bot.queries.get_guild_autoresponses, [message.guild.id], function(err, autoresponses) {
                        lookup = []
                        for (const key in autoresponses) {
                            const element = autoresponses[key];
                            lookup.push(element.user_message)
                        }
                        if(lookup.includes(message.content)) {
                            bot.con.query(bot.queries.get_autoresponse, [message.guild.id, message.content], async function(err, autoresponse) {
                                autoresponse = autoresponse[0]
                                let responses = autoresponse.responses ? autoresponse.responses.split("|") : ""
                                let reactions = autoresponse.reactions ? autoresponse.reactions.split("|") : ""
                                console.log(responses, reactions)
                                if (responses.length > 0) {
                                    message.channel.send(await bot.placeholders.replace(bot, message, responses[bot.random(0,responses.length - 1)]))
                                }
                                if (reactions.length > 0) message.react(reactions[bot.random(0, reactions.length - 1)].trim())
                            })
                        }
                    })
*/
                    let prefix_used = bot.prefix.filter(e => message.content.toLowerCase().startsWith(e))
                    if(prefix_used.length === 0) return
                    prefix_used = prefix_used[0]
                    let args = message.content.slice(prefix_used.length).split(" ").slice(1).join(" ")
                    let cmd = message.content.slice(prefix_used.length).split(" ")[0]
                    
                    let commandFile = bot.commands.find(c => c.help.name.toLowerCase() == cmd.toLowerCase()) || bot.commands.find(c=> c.help.alias ? c.help.alias.includes(cmd.toLowerCase()) : false)      
                    if(!commandFile || !commandFile.help.status) return
                    if(commandFile.help.deleted) message.delete()
                    if(!bot.config.staff.includes(message.author.id)){
                        if(commandFile.help.permissions.user && !message.member.hasPermission(commandFile.help.permissions.user)) return bot.erreur("You don't have enough permission !",message.channel.id)
                        if(commandFile.help.permissions.bot && !message.guild.me.hasPermission(commandFile.help.permissions.bot)) return bot.erreur("I don't have enough permission !",message.channel.id)
                        if(commandFile.help.developer) return bot.erreur("You don't have enough permission !",message.channel.id)
                        if(commandFile.help.permissions.role && commandFile.help.permissions.role !== ""){
                            let role = message.guild.roles.cache.get(commandFile.help.permissions.role)
                            if(!role) return bot.erreur("Permission role not found !",message.channel.id)
                            if(!message.member.roles.cache.has(role.id) && message.member.roles.highest.position < role.position) return bot.erreur("You don't have enough permission !",message.channel.id)
                        }

                        let user_cooldown = bot.cooldown.find(e => e.user_id === message.author.id && e.command === commandFile.help.name.toLowerCase() && e.count >= commandFile.help.use_per_cooldown)
                        if(user_cooldown){
                            let time_left = user_cooldown.cooldown - (Date.now() - user_cooldown.start_at)
                            if(time_left > 1000) return bot.erreur("You can do this command in `" + get_time(time_left) + "` !",message.channel.id)
                            else bot.cooldown.splice(bot.cooldown.indexOf(user_cooldown),1)
                        }
                    }


                    commandFile.run(bot, message, args)
                    
                    if(commandFile.help.cooldown !== 0) {
                        let duration = commandFile.help.cooldown
                        let already = bot.cooldown.find(e => e.user_id === message.author.id && e.command === commandFile.help.name)
                        if(already){
                            already.count++
                            if(already.count === commandFile.help.use_per_cooldown) already.start_at = message.createdTimestamp
                        } else bot.cooldown.push({
                            user_id:message.author.id,
                            cooldown:duration,
                            start_at:message.createdTimestamp,
                            command:commandFile.help.name.toLowerCase(),
                            count:1
                        })
                    }
                })
            })
        })
    })
    } catch {

    } 
});


bot.on("raw",event => {
    if(event.t !== "MESSAGE_REACTION_ADD") return
    if(event.d.user_id === bot.user.id) return
    if(event.d.emoji.name !== "🎉") return
    bot.con.query(bot.queries.get_giveaway,[event.d.message_id],function(err,giveaway){
        if(!giveaway || giveaway.length === 0) return
        giveaway = giveaway[0]
        giveaway.parts = JSON.parse(giveaway.parts)
        if(giveaway.state !== "in_progress") return
        if(giveaway.parts.includes(event.d.user_id)) return
        giveaway.parts.push(event.d.user_id)
        bot.con.query(bot.queries.update_giveaway_parts,[JSON.stringify(giveaway.parts),event.d.message_id])
    })
})

bot.on("raw",event => {
    if(event.t !== "MESSAGE_REACTION_ADD") return
    if(event.d.user_id === bot.user.id) return
    if(event.d.emoji.name !== "📥") return
    bot.con.query(bot.queries.get_guild_config,[event.d.guild_id],async function(err,guild_config){
        if(!guild_config || guild_config.length === 0) return
        guild_config = guild_config[0]
        if(event.d.message_id !== guild_config.ticket_message) return
        let channel = bot.channels.cache.get(event.d.channel_id)
        if(!channel) return
        let guild = bot.guilds.cache.get(event.d.guild_id)
        if(!guild) return
        let msg = await channel.messages.fetch(event.d.message_id).catch(err => {})
        let reactionEmote = msg.reactions.cache.filter(reaction => reaction.users.cache.has(event.d.user_id))
        reactionEmote.forEach(reaction => reaction.users.remove(event.d.user_id))

        let already = guild.channels.cache.find(e => e.topic && e.topic === event.d.user_id)
        if(already) return
        let ticket = await guild.channels.create("ticket-" + event.d.member.user.username,{type:"text",topic:event.d.user_id}).catch(err => console.log(err))
        if(!ticket) return
        ticket.createOverwrite(event.d.guild_id,{"VIEW_CHANNEL":false,"SEND_MESSAGES":false})
        ticket.createOverwrite(event.d.user_id,{"VIEW_CHANNEL":true,"SEND_MESSAGES":true})
        if(guild_config.ticket_category !== "") ticket.setParent(guild_config.ticket_category)
        ticket.send("<@" + event.d.user_id + ">",{embed:{
            color:bot.config.colors.main,
            author:{
                name:"Thanks for opening a ticket !",
                iconURL:bot.user.displayAvatarURL()
            },
            description:"A staff will come..."
        }}).then(m => m.react("🔒"))
    })
})

bot.on("raw",event => {
    if(event.t !== "MESSAGE_REACTION_ADD") return
    if(event.d.user_id === bot.user.id) return
    if(event.d.emoji.name !== "🔒") return

    let channel = bot.channels.cache.get(event.d.channel_id)
    if(!channel) return
    if(!channel.topic || channel.topic.length !== 18) return
    let guild = bot.guilds.cache.get(event.d.guild_id)
    if(!guild) return
    if(!guild.member(event.d.user_id).hasPermission("ADMINISTRATOR") && event.d.user_id !== channel.topic) return
    channel.createOverwrite(event.d.user_id,{"VIEW_CHANNEL":false})
    channel.send({embed:{
        color:bot.config.colors.main,
        description:"<@" + channel.topic + ">'s ticket has been closed !"
    }}).then(m => {
        m.react("❌")
        m.react("✅")
    })
})

bot.on("raw",event => {
    if(event.t !== "MESSAGE_REACTION_ADD") return
    if(event.d.user_id === bot.user.id) return
    if(event.d.emoji.name !== "✅") return

    let channel = bot.channels.cache.get(event.d.channel_id)
    if(!channel) return
    if(!channel.topic || channel.topic.length !== 18) return
    let guild = bot.guilds.cache.get(event.d.guild_id)
    if(!guild) return
    if(!guild.member(event.d.user_id).hasPermission("ADMINISTRATOR") && event.d.user_id !== channel.topic) return
    channel.createOverwrite(event.d.user_id,{"VIEW_CHANNEL":true})
    channel.send({embed:{
        color:bot.config.colors.main,
        description:"<@" + channel.topic + ">'s ticket has been reopened !"
    }})
})

bot.on("raw",event => {
    if(event.t !== "MESSAGE_REACTION_ADD") return
    if(event.d.user_id === bot.user.id) return
    if(event.d.emoji.name !== "❌") return

    let channel = bot.channels.cache.get(event.d.channel_id)
    if(!channel) return
    if(!channel.topic || channel.topic.length !== 18) return
    let guild = bot.guilds.cache.get(event.d.guild_id)
    if(!guild) return
    if(!guild.member(event.d.user_id).hasPermission("ADMINISTRATOR")) return
    channel.send({embed:{
        color:bot.config.colors.main,
        description:"Ticket will be deleted in a few seconds !"
    }})

    setTimeout(() => channel.delete(),5000)
})

bot.on("raw", async event => {
    if(!["MESSAGE_REACTION_ADD","MESSAGE_REACTION_REMOVE"].includes(event.t)) return
    if(event.d.user_id === bot.user.id) return
    let filter_reaction = "";
    (event.d.emoji.id === null ? filter_reaction = event.d.emoji.name : filter_reaction = event.d.emoji.id + " " + event.d.emoji.name)
    bot.con.query(bot.queries.get_reaction,[event.d.message_id,filter_reaction],function(err,result){
        if(!result || result.length === 0) return
        let unique = result[0].uniq === 1
        let binding = result[0].binding === 1
        let utilisateur = bot.users.cache.get(event.d.user_id)
        let guild = bot.guilds.cache.get(event.d.guild_id)
        if(!utilisateur || !guild) return
        result.forEach(e => {
            if(event.t === "MESSAGE_REACTION_ADD"){
                guild.member(utilisateur).roles.add(e.role_id)
                if(unique){
                    bot.con.query(bot.queries.get_all_linked,[result[0].linked_key],function(err,all){
                        if(!all) return
                        all.forEach(e => {
                            let role = guild.roles.cache.get(e.role_id)
                            if(role.id === result[0].role_id) return
                            if(guild.member(utilisateur).roles.cache.has(role.id)) guild.member(utilisateur).roles.remove(role.id)
                        })
                    })
                }
            } else if(!binding) guild.member(utilisateur).roles.remove(e.role_id)
        })
    })
})


bot.on("guildMemberAdd", member => {
    if(!member.guild) return
    bot.con.query(bot.queries.get_guild_config,[member.guild.id],function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        let welcome_channel = bot.channels.cache.get(guild.welcome_channel)
        guild.welcome_message = guild.welcome_message.toString("utf8").replace(/{member}/g,`<@${member.id}>`)
        .replace(/{member.name}/g,member.user.username)
        .replace(/{member.id}/g,member.id)
        .replace(/{member.tag}/g,member.user.tag)
        .replace(/{membercount}/g,member.guild.memberCount)
        .replace(/{avatar}/g,member.user.displayAvatarURL({format:"png"}))
        .replace(/{servericon}/g,member.guild.iconURL())
        .replace(/{welcomeimage}/g,guild.welcome_image)
        .replace(/{leaveimage}/g,guild.leave_image)
        if(welcome_channel){
            if(guild.welcome_message.startsWith("{")) welcome_channel.send({embed:JSON.parse(guild.welcome_message)})
            else welcome_channel.send(guild.welcome_message)
        }

        if(guild.log_channel === "") return
        let embed = {embed:{
            color:bot.config.colors.green,
            author:{
                name:"A member joins !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Member",
                    value:"<@" + member.id + ">",
                    inline:true
                },
                {
                    name:"ID",
                    value:"`" + member.id + "`",
                    inline:true
                },
                {
                    name:"Membercount",
                    value:"`" + member.guild.memberCount + "`",
                    inline:true
                },
                {
                    name:"Date",
                    value:"`" + date.format(member.user.createdAt,"DD/MM/YYYY - HH:mm") + "`",
                    inline:true
                }
            ],
            timestamp:new Date()
        }}

        bot.log(embed,guild.log_channel)
    })
})

bot.on("guildMemberRemove", member => {
    if(!member.guild) return
    bot.con.query(bot.queries.get_guild_config,[member.guild.id],function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        let leave_channel = bot.channels.cache.get(guild.leave_channel)
        if(leave_channel) {
            let leaveMessage = guild.leave_message.toString("utf8").replace(/{member}/g,"<@" + member.id + ">")
            .replace(/{member.name}/g,member.user.username)
            .replace(/{member.id}/g,member.id)
            .replace(/{member.tag}/g,member.user.tag)
            .replace(/{membercount}/g,member.guild.memberCount)
            .replace(/{avatar}/g,member.user.displayAvatarURL({format:"png"}))
            .replace(/{servericon}/g,member.guild.iconURL({format:"png"}))
            .replace(/{welcomeimage}/g,guild.welcome_image)
            .replace(/{leaveimage}/g,guild.leave_image)

            if (leaveMessage.startsWith("{")) {
                leave_channel.send({embed:JSON.parse(leaveMessage)})
            } else {
                leave_channel.send(leaveMessage.toString("utf8"))
            }
        }
        if(guild.log_channel === "") return 
        let createDate = new Date(member.user.createdAt)
        let embed = {embed:{
            color:bot.config.colors.red,
            author:{
                name:"A member leaves",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Member",
                    value:"<@" + member.id + ">",
                    inline:true
                },
                {
                    name:"ID",
                    value:"`" + member.id + "`",
                    inline:true
                },
                {
                    name:"New member count",
                    value:"`" + member.guild.memberCount + "`",
                    inline:true
                },
                {
                    name:"Date",
                    value:"" + "DD/MM/YYYY - HH:mm".replace(/DD/g, `0${createDate.getDate()}`.slice(-2))
                    .replace(/MM/g, `0${createDate.getMonth() + 1}`.slice(-2))
                    .replace(/YYYY/g, createDate.getFullYear())
                    .replace(/HH/g, `0${createDate.getHours()}`.slice(-2))
                    .replace(/mm/g, `0${createDate.getMinutes()}`.slice(-2)) + "",
                    inline:true
                }
            ],
            timestamp:new Date()
        }}
        bot.log(embed,guild.log_channel)
    })
})

bot.on("messageDelete",message => {
    if(!message.guild) return
    bot.con.query(bot.queries.get_guild_config,[message.guild.id],function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        let embed = {embed:{
            color:bot.config.colors.red,
            author:{
                name:"Message deleted !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Author",
                    value:(message.author ? "<@" + message.author.id + ">" : "`Unknown`"),
                    inline:true
                },
                {
                    name:"Channel",
                    value:"<#" + message.channel + ">",
                    inline:true
                },
                {
                    name:"Content",
                    value:"`" + (message.content === null || message.content === "" ? "Embed !" : message.content.slice(0,500)) + "`",
                }
            ],
            timestamp:new Date()
        }}
    
        bot.log(embed,guild.log_channel)
    })
})

bot.on("messageUpdate",(oldMessage,newMessage) => {
    if(newMessage.author !== null && newMessage.author.id === bot.user.id) return
    bot.con.query(bot.queries.get_guild_config,[newMessage.guild.id],function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        let embed = ""
        if(!oldMessage.pinned && newMessage.pinned){
            embed = {embed:{
                color:bot.config.colors.green,
                author:{
                    name:"Message pinned !",
                    icon_url:bot.user.displayAvatarURL()
                },
                fields:[
                    {
                        name:"Author",
                        value:(oldMessage.author === null ? "`Unknown`" : "<@" + oldMessage.author.id + ">"),
                        inline:true
                    },
                    {
                        name:"Channel",
                        value:oldMessage.channel,
                        inline:true
                    },
                    {
                        name:"Message",
                        value:"**[Click](" + oldMessage.url + ")**",
                        inline:true
                    }
                ]
            }}
        } else {
            embed = {embed:{
                color:bot.config.colors.red,
                author:{
                    name:"Message edited !",
                    icon_url:bot.user.displayAvatarURL()
                },
                fields:[
                    {
                        name:"Author",
                        value:(oldMessage.author === null ? "`Unknown`" : "<@" + oldMessage.author.id + ">"),
                        inline:true
                    },
                    {
                        name:"Channel",
                        value:oldMessage.channel,
                        inline:true
                    },
                    {
                        name:"Message",
                        value:"**[Click](" + oldMessage.url + ")**",
                        inline:true
                    },
                    {
                        name:"Old content",
                        value:(oldMessage.content === "" ? "Embed !" : oldMessage.content === null ? "" : oldMessage.content.slice(0,200)),
                        inline:true
                    },
                    {
                        name:"New content",
                        value:(newMessage.content === "" ? "Embed !" : newMessage.content === null ? "" : newMessage.content.slice(0,200)),
                        inline:true
                    }
                ],
                timestamp:new Date()
            }}
        }

        bot.log(embed,guild.log_channel)
    })
})

bot.on("guildMemberUpdate",(oldMember,newMember) => {
    bot.con.query(bot.queries.get_guild_config,[newMember.guild.id],function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        if(oldMember.nickname === newMember.nickname) return
        let embed = {embed:{
            color:bot.config.colors.red,
            author:{
                name:"Nickname changed !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Old nickname",
                    value:(oldMember.nickname === null ? oldMember.user.username : oldMember.nickname),
                    inline:true
                },
                {
                    name:"New nickname",
                    value:(newMember.nickname === null ? newMember.user.username : newMember.nickname),
                    inline:true
                }
            ],
            timestamp:new Date()
        }}
        bot.log(embed,guild.log_channel)
    })
})

bot.on("roleCreate", async role => {
    bot.con.query(bot.queries.get_guild_config,[role.guild.id],async function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())

        let embed = {embed:{
            color:bot.config.colors.green,
            author:{
                name:"Role created !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Role",
                    value:role,
                    inline:true
                },
                {
                    name:"Color",
                    value:"`#" + role.color.toString(16) + "`",
                    inline:true
                },
                {
                    name:"Created by",
                    value:"`" + entry.executor.tag + "`"
                }
            ]
        }}
        bot.log(embed,guild.log_channel)
    })
})

bot.on("roleDelete", async role => {
    bot.con.query(bot.queries.get_guild_config,[role.guild.id],async function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())

        let embed = {embed:{
            color:bot.config.colors.red,
            author:{
                name:"Role deleted !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Role",
                    value:"`" + role.name + "`",
                    inline:true
                },
                {
                    name:"Color",
                    value:"`#" + role.color.toString(16) + "`",
                    inline:true
                },
                {
                    name:"Deleted by",
                    value:"`" + entry.executor.tag + "`"
                }
            ]
        }}
        bot.log(embed,guild.log_channel)
    })
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
    bot.con.query(bot.queries.get_guild_config,[newState.guild.id],async function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        let oldChannel = oldState.channel
        let newChannel = newState.channel
        let embed = {embed:{color:bot.config.colors.main,author:{name:"",icon_url:bot.user.displayAvatarURL()},fields:[],timestamp:Date.now()}}
        if(oldChannel && newChannel && oldChannel.id !== newChannel.id){
            const entry = await newChannel.guild.fetchAuditLogs({type: 'MEMBER_MOVE'}).then(audit => audit.entries.first())
            let time = (Date.now() - entry.createdTimestamp)
            embed.embed.author.name = "Vocal change !"
            embed.embed.color = bot.config.colors.red
            embed.embed.fields.push({name:"Old channel" + " :",value:"`" + oldChannel.name + "`",inline:true})
            embed.embed.fields.push({name:"New channel" + " :",value:"`" + newChannel.name + "`",inline:true})
            embed.embed.fields.push({name:"Member" + " :",value:"`" + newState.member.user.username + "`",inline:true})
            embed.embed.fields.push({name:"Moved by" + " :",value:"`" + (time > 2000 ? newState.member.user.username : entry.executor.tag) + "`",inline:true})
            bot.log(embed,guild.log_channel)
        } else if(oldChannel && !newChannel){
            embed.embed.author.name = "Vocal leave !"
            embed.embed.color = bot.config.colors.red
            embed.embed.fields.push({name:"Channel" + " :",value:"`" + oldChannel.name + "`",inline:true})
            embed.embed.fields.push({name:"Member" + " :",value:"`" + oldState.member.user.username + "`",inline:true})
            bot.log(embed,guild.log_channel)
        } else if(!oldChannel && newChannel){
            embed.embed.author.name = "Vocal join !"
            embed.embed.color = bot.config.colors.green
            embed.embed.fields.push({name:"Channel" + " :",value:"`" + newChannel.name + "`",inline:true})
            embed.embed.fields.push({name:"Member" + " :",value:"`" + oldState.member.user.username + "`",inline:true})
            bot.log(embed,guild.log_channel)
        }
    })
})

bot.on("channelCreate", async channel => {
    if(!channel.guild) return
    bot.con.query(bot.queries.get_guild_config,[channel.guild.id],async function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first())
        
        let embed = {embed:{
            color:bot.config.colors.green,
            author:{
                name:"Channel created !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Channel",
                    value:channel,
                    inline:true
                },
                {
                    name:"Type",
                    value:"`" + channel.type + "`" || "`Text`",
                    inline:true
                },
                {
                    name:"Created by",
                    value:"`" + entry.executor.tag + "`",
                    inline:true
                }
            ],
            timestamp:Date.now()
        }}
        bot.log(embed,guild.log_channel)
    })
})

bot.on("channelDelete", async channel => {
    bot.con.query(bot.queries.get_guild_config,[channel.guild.id],async function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
        
        let embed = {embed:{
            color:bot.config.colors.red,
            author:{
                name:"Channel deleted !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Channel",
                    value:"`" + channel.name + "`",
                    inline:true
                },
                {
                    name:"Type",
                    value:"`" + channel.type + "`" || "`Text`",
                    inline:true
                },
                {
                    name:"Category",
                    value:channel.parent === null ? "`❌`" : "`" + channel.parent.name + "`",
                    inline:true
                },
                {
                    name:"Deleted by",
                    value:"`" + entry.executor.tag + "`",
                    inline:true
                }
            ],
            timestamp:Date.now()
        }}
        bot.log(embed,guild.log_channel)
    })
})

bot.on("channelUpdate", async (oldChannel,newChannel) => {
    bot.con.query(bot.queries.get_guild_config,[newChannel.guild.id],async function(err,guild){
        if(!guild || guild.length === 0) return
        guild = guild[0]
        if(guild.log_channel === "") return
        const entry = await oldChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first())
        let old_name = oldChannel.name
        let new_name = newChannel.name

        if(old_name === new_name) return
        
        let embed = {embed:{
            color:bot.config.colors.red,
            author:{
                name:"Channel edited !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Old name",
                    value:"`" + old_name + "`",
                    inline:true
                },
                {
                    name:"New name",
                    value:"`" + new_name + "`",
                    inline:true
                },
                {
                    name:"Edited by",
                    value:"`" + entry.executor.tag + "`",
                    inline:true
                }
            ],
            timestamp:Date.now()
        }}
        bot.log(embed,guild.log_channel)
    })
})

function erreur(message,channel_id,option){
    let channel = bot.channels.cache.get(channel_id)
    if(channel) channel.send({embed:{
        color:bot.config.colors.red,
        description:message
    }}).then(msg => {
        if(option) msg.delete({timeout:5000})
    })
}

function get_time(time,is_full){
    let temps = time
    let displayTime = ""
    let secondesTime = Math.floor(temps / 1000) % 60;
    let minutesTime = Math.floor(temps / 60000) % 60;
    let heuresTime = Math.floor(temps / 3600000) % 24
    let joursTime = Math.floor(temps / 86400000);
    if(joursTime !== 0) displayTime += joursTime + (is_full ? joursTime > 1 ? " days " : " day " : "d");
    if(heuresTime !== 0) displayTime += heuresTime + (is_full ? heuresTime > 1 ? " hours " : " hour " : "h");
    if(minutesTime !== 0) displayTime += minutesTime + (is_full ? minutesTime > 1 ? " minutes " : " minute " : "m");
    if(secondesTime !== 0) displayTime += secondesTime + (is_full ? secondesTime > 1 ? " seconds " : " second " : "s");
    if(displayTime.endsWith(" ")) displayTime = displayTime.slice(0,-1)
    return displayTime
}


function random(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function convert(number){
    return new Intl.NumberFormat().format(number)
}

function remove_cooldown(id,command){
    bot.cooldown.splice(bot.cooldown.findIndex(e => e.user_id === id && e.command === command.toLowerCase()))
}

async function queued(songs,type,channel,erreur){
    let array = []
    switch(type){
        case "youtube":
            array.push({
                name:songs.name,
                group:songs.group,
                asked:songs.asked,
                date:songs.date,
                lien:songs.id,
                duration:songs.duration,
                start_at:songs.start_at
            })
            break;
    }
    setTimeout(() => {
        let chan = bot.channels.cache.get(channel)
        let queue = bot.queue.find(e => e.guild_id === chan.guild.id)
        if(!queue) bot.queue.push({guild_id:chan.guild.id,songs:[array[0]]})
        else queue.songs.push(array[0])
        if(!bot.playing[chan.guild.id]) bot.playQueue(channel,erreur)
    },3000)
}

async function playQueue(channel,erreur){
    try {
        let voice = bot.channels.cache.get(channel)
        if(!voice) return bot.erreur("No vocal detected !",erreur)
        let queue = bot.queue.find(e => e.guild_id === voice.guild.id)
        if(!queue) return
        let connection = await voice.join()
        if(!connection) return
        let url = "https://www.youtube.com/watch?v=" + queue.songs[0].lien;
        let stream = ytdl(url,{filter : "audioonly"})
        let dispatcher = connection.play(stream,streamOptions)
        bot.playing[voice.guild.id] = true
        let msg_channel = bot.channels.cache.get(erreur)
        if(!msg_channel) return
        msg_channel.send({embed:{
            color:bot.config.colors.main,
            author:{
                name:"Next music !",
                icon_url:bot.user.displayAvatarURL()
            },
            fields:[
                {
                    name:"Artist",
                    value:"`" + queue.songs[0].group + "`",
                    inline:true
                },
                {
                    name:"Title",
                    value:"`" + queue.songs[0].name + "`",
                    inline:true
                },
                {
                    name:"Duration",
                    value:"`" + bot.get_time(queue.songs[0].duration) + "`",
                    inline:true
                },
                {
                    name:"Released in",
                    value:"`" + queue.songs[0].date + "`",
                    inline:true
                },
                {
                    name:"Asked by",
                    value:"<@" + queue.songs[0].asked + ">",
                    inline:true
                }
            ]
        }})
        dispatcher.on("finish",() => {
            queue.songs.shift()
            if(queue.songs.length === 0) bot.playing[voice.guild.id] = false,bot.queue.splice(bot.queue.indexOf(queue),1), voice.leave()
            else bot.playQueue(channel,erreur)
        })
    } catch(error) {
        console.log(error)
    }
}

function convert_duration(duration){
    let total = ms(duration.hours + "h") + ms(duration.minutes + "m") + ms(duration.seconds + "s")
    return total
}

function updateGiveaway(){
    bot.con.query(bot.queries.get_giveaways,[],async function(err,giveaways){
        if(!giveaways || giveaways.length === 0) return
        giveaways = giveaways.filter(e => e.state === "in_progress")
        giveaways.forEach(async giveaway => {
            giveaway.parts = JSON.parse(giveaway.parts)
            let time_left = giveaway.duration - (Date.now() - giveaway.start_at)
            let channel = bot.channels.cache.get(giveaway.channel_id)
            if(!channel) return bot.con.query(bot.queries.delete_giveaway,[message_id])
            let msg = await channel.messages.fetch(giveaway.message_id)
            if(!msg) return bot.con.query(bot.queries.delete_giveaway,[giveaway.message_id])
            let embed = msg.embeds[0]

            if(time_left < 15000){
                if(giveaway.parts.length >= (giveaway.winners + 1)){
                    let winners = []
                    for(let x = 0; x < giveaway.winners; x++){
                        let rand = random(0,giveaway.parts.length - 1)
                        winners.push(giveaway.parts[rand])
                        giveaway.parts.splice(rand,1)
                    }
                    embed.author.name = "Giveaway ended !"
                    embed.description = "Giveaway ended, " + winners.map(e => "<@" + e + ">").join(", ") + " win `" + giveaway.gift + "` !"
                } else {
                    embed.author.name = "Giveaway ended !"
                    embed.description = "There were not enough participants !"
                }
                msg.edit(embed)
                msg.reactions.removeAll()
                bot.con.query(bot.queries.update_giveaway_state,["ended",giveaway.message_id])
            } else {
                embed.description = "**Winners :** `" + giveaway.winners + "`" +
                "\n**Hosted by :** <@" + giveaway.user_id + ">" +
                "\n\n**Duration :** `" + bot.get_time(time_left,true) + "`"
                msg.edit(embed)
            }
        })
    })
}

function updateModeration(){
    bot.con.query(bot.queries.get_muted,[],function(err,muted){
        if(!muted || muted.length === 0) return
        for(let i = 0; i < muted.length; i++){
            let concerned = muted[i],
            time_left = concerned.duration - (Date.now() - concerned.start_at)
            if(time_left < 0){
                let guild = bot.guilds.cache.get(concerned.guild_id)
                if(guild){
                    let utilisateur = guild.members.cache.get(concerned.user_id),
                    role = guild.roles.cache.get(concerned.mute_role)
                    if(utilisateur && role) utilisateur.roles.remove(role.id)
                }
                bot.con.query(bot.queries.unmute,[concerned.user_id,concerned.guild_id])
            }
        }
    })

    bot.con.query(bot.queries.get_banned,[],async function(err,banned){
        if(!banned || banned.length === 0) return
        for(let i = 0; i < banned.length; i++){
            let concerned = banned[i],
            time_left = concerned.duration - (Date.now() - concerned.start_at)
            if(time_left < 0){
                let guild = bot.guilds.cache.get(concerned.guild_id)
                let ban = await guild.fetchBan(concerned.user_id)
                if(guild && ban) guild.members.unban(concerned.user_id)
                bot.con.query(bot.queries.unban,[concerned.user_id,concerned.guild_id])
            }
        }
    })
}

function get_id(){
    let list = ["a","b","c","d","e","f","g","h","1","2","3","4","5","6","7","8","9"]
    let code = ""
    while(code.length < 5) code += list[random(0,list.length - 1)]
    return code.toUpperCase()
}


function log(embed,channel){
    let chan = bot.channels.cache.get(channel)
    if(chan) chan.send(embed)
}