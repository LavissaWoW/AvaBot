module.exports.run = async(bot, message, args) => {
    let ID = args
    if(!ID) return bot.erreur("You must enter a message ID !",message.channel.id)
    let msg = await message.channel.messages.fetch(ID).catch(err => {})
    if(!msg) return bot.erreur("Message not found !",message.channel.id)
    let already_message = bot.reaction_menu.find(e => e.message_id === msg.id)
    if(already_message) return bot.erreur("This message is already setting up !",message.channel.id)
    bot.con.query(bot.queries.get_message_reaction,[msg.id,message.channel.id],async function(err,reaction_message){
        if(!reaction_message || reaction_message.length === 0) bot.reaction_menu.push({message_id:msg.id,channel_id:message.channel.id,linked_key:bot.get_id(),unique:false,binding:false,roles:[]})
        else bot.reaction_menu.push({message_id:msg.id,channel_id:message.channel.id,linked_key:reaction_message[0].linked_key,unique:reaction_message[0].uniq == 1,binding:reaction_message[0].binding == 1,roles:reaction_message})

        let menu = bot.reaction_menu.find(e => e.message_id === msg.id)
        if(!menu) return
        let menu_message = await message.channel.send({embed:{
            color:bot.config.colors.main,
            title:"Reaction Role setup !",
            url:"https://discord.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + msg.id,
            description:"🌕 - **Add role**" +
            "\n🌑 - **Remove role**" +
            "\n💀 - **Unique role** (" + (menu.unique ? "✅" : "❌") + ")" +
            "\n♻️ - **Binding role** (" + (menu.binding ? "✅" : "❌") + ")" +
            "\n\n**__Current roles :__**" +
            "\n\n" + (menu.roles.length === 0 ? "No role at this time" : menu.roles.map(e => "• <@&" + e.role_id + "> - " + (e.reaction.toString("utf8").match(/\d{18,20} .*/) == null ? e.reaction.toString("utf8") : "<:" + e.reaction.toString("utf8").split(" ")[1] + ":" + e.reaction.toString("utf8").split(" ")[0] + ">")).join("\n"))
        }})

        menu_message.react("🌕")
        menu_message.react("🌑")
        menu_message.react("💀")
        menu_message.react("♻️")
        menu_message.react("✅")

        let filter = (reaction,user) => ["🌕","🌑","💀","♻️","✅"].includes(reaction.emoji.name) && user.id === message.author.id,
        collector = menu_message.createReactionCollector(filter),
        embed = menu_message.embeds[0]

        collector.on("collect",async (reaction,other) => {
            let reactionEmote = menu_message.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
            reactionEmote.forEach(reaction => reaction.users.remove(message.author.id))
            switch(reaction.emoji.name){
                case "🌕":
                    if(menu.roles.length >= 20) return bot.erreur("Role limit reached !",message.channel.id,true)
                    let add_question = await message.channel.send({embed:{
                        color:bot.config.colors.main,
                        description:"Please send the role and the reaction splited by a space !"
                    }})

                    let add_filter = m => m.author.id === message.author.id,
                    add_collector = message.channel.createMessageCollector(add_filter,15000)

                    add_collector.on("collect",m => {
                        m.delete()
                        if(!m.content) return
                        let infos = m.content.split(" ")
                        if(infos.length !== 2) return
                        let add_role = infos.find(e => e.length === 22)
                        if(!add_role) return
                        let role = message.guild.roles.cache.get(add_role.slice(3,-1))
                        if(!role) return
                        if(role.position > message.guild.me.roles.highest.position) return bot.erreur("The role must be lower than mine !",message.channel.id,true)
                        let reaction = infos[infos.indexOf(add_role) === 0 ? 1 : 0]
                        let is_normal = reaction.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)
                        let is_custom = reaction.match(/<a?:\w+:\d{18,20}>/)
                        let name = ""
                        if(is_normal === null && is_custom === null) return bot.erreur("Reaction not found !",message.channel.id,true)
                        if(is_normal === null) name = " " + reaction.split(":")[1], reaction = reaction.split(":")[2].slice(0,-1)
                        msg.react(reaction)
                        menu.roles.push({guild_id:message.guild.id,channel_id:message.channel.id,message_id:msg.id,role_id:role.id,reaction:reaction + name}) 
                        bot.con.query(bot.queries.create_role_reaction,[message.guild.id,message.channel.id,msg.id,role.id,reaction + name,menu.unique,menu.binding,menu.linked_key])
                        add_collector.stop()
                        embed.description = "🌕 - **Add role**" +
                        "\n🌑 - **Remove role**" +
                        "\n💀 - **Unique role** (" + (menu.unique ? "✅" : "❌") + ")" +
                        "\n♻️ - **Binding role** (" + (menu.binding ? "✅" : "❌") + ")" +
                        "\n\n**__Current roles :__**" +
                        "\n\n" + (menu.roles.length === 0 ? "No role at this time" : menu.roles.map(e => "• <@&" + e.role_id + "> - " + (e.reaction.toString("utf8").match(/\d{18,20} .*/) == null ? e.reaction.toString("utf8") : "<:" + e.reaction.toString("utf8").split(" ")[1] + ":" + e.reaction.toString("utf8").split(" ")[0] + ">")).join("\n"))
                        menu_message.edit(embed)
                    })
                    add_collector.on("end",collected => {
                        add_question.delete()
                    })
                    break;
                case "🌑":
                    if(menu.roles.length == 0) return bot.erreur("There is not role to remove !",message.channel.id,true)
                    let remove_question = await message.channel.send({embed:{
                        color:bot.config.colors.main,
                        description:"Please mention a role !"
                    }})

                    let remove_filter = m => m.author.id === message.author.id,
                    remove_collector = message.channel.createMessageCollector(remove_filter,15000)

                    remove_collector.on("collect",m => {
                        m.delete()
                        if(!m.content) return
                        let mention = m.mentions.roles.first()
                        if(!mention) return
                        bot.con.query(bot.queries.get_reactions_by_role,[msg.id,mention.id],function(err,roles){
                            if(!roles) return
                            roles.forEach(role => {
                                menu.roles.splice(menu.roles.findIndex(e => e.role_id === role.role_id),1)
                                let emote_name = (role.reaction.toString("utf8").match(/\d{18,20} .*/) == null ? role.reaction.toString("utf8") : role.reaction.toString("utf8").split(" ")[1])
                                let reaction_remove = msg.reactions.cache.filter(reaction => reaction.emoji.name === emote_name);
                                reaction_remove.forEach(reaction => reaction.users.remove(bot.user.id))
                            })
                            bot.con.query(bot.queries.delete_role_reaction,[msg.id,mention.id])
                            remove_collector.stop()
                            embed.description = "🌕 - **Add role**" +
                            "\n🌑 - **Remove role**" +
                            "\n💀 - **Unique role** (" + (menu.unique ? "✅" : "❌") + ")" +
                            "\n♻️ - **Binding role** (" + (menu.binding ? "✅" : "❌") + ")" +
                            "\n\n**__Current roles :__**" +
                            "\n\n" + (menu.roles.length === 0 ? "No role at this time" : menu.roles.map(e => "• <@&" + e.role_id + "> - " + (e.reaction.toString("utf8").match(/\d{18,20} .*/) == null ? e.reaction.toString("utf8") : "<:" + e.reaction.toString("utf8").split(" ")[1] + ":" + e.reaction.toString("utf8").split(" ")[0] + ">")).join("\n"))
                            menu_message.edit(embed)
                        })
                    })
                    remove_collector.on("end",collected => {
                        remove_question.delete()
                    })
                    break;
                case "💀":
                    menu.unique = !menu.unique
                    bot.con.query(bot.queries.update_unique,[menu.unique,menu.linked_key])
                    embed.description = "🌕 - **Add role**" +
                    "\n🌑 - **Remove role**" +
                    "\n💀 - **Unique role** (" + (menu.unique ? "✅" : "❌") + ")" +
                    "\n♻️ - **Binding role** (" + (menu.binding ? "✅" : "❌") + ")" +
                    "\n\n**__Current roles :__**" +
                    "\n\n" + (menu.roles.length === 0 ? "No role at this time" : menu.roles.map(e => "• <@&" + e.role_id + "> - " + (e.reaction.toString("utf8").match(/\d{18,20} .*/) == null ? e.reaction.toString("utf8") : "<:" + e.reaction.toString("utf8").split(" ")[1] + ":" + e.reaction.toString("utf8").split(" ")[0] + ">")).join("\n"))
                    menu_message.edit(embed)
                    break;
                case "♻️":
                    menu.binding = !menu.binding
                    bot.con.query(bot.queries.update_binding,[menu.binding,menu.linked_key])
                    embed.description = "🌕 - **Add role**" +
                    "\n🌑 - **Remove role**" +
                    "\n💀 - **Unique role** (" + (menu.unique ? "✅" : "❌") + ")" +
                    "\n♻️ - **Binding role** (" + (menu.binding ? "✅" : "❌") + ")" +
                    "\n\n**__Current roles :__**" +
                    "\n\n" + (menu.roles.length === 0 ? "No role at this time" : menu.roles.map(e => "• <@&" + e.role_id + "> - " + (e.reaction.toString("utf8").match(/\d{18,20} .*/) == null ? e.reaction.toString("utf8") : "<:" + e.reaction.toString("utf8").split(" ")[1] + ":" + e.reaction.toString("utf8").split(" ")[0] + ">")).join("\n"))
                    menu_message.edit(embed)
                    break;
                case "✅":
                    embed.description = "Modifications has been saved !"
                    menu_message.edit(embed)
                    menu_message.reactions.removeAll()
                    collector.stop()
                    bot.reaction_menu.splice(bot.reaction_menu.indexOf(menu),1)
                    break;
            }
        })
        
    })

    
}


module.exports.help = {
    name:"reactionrole",
    alias: ["rr"],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Edit reaction role message",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}
