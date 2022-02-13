module.exports.run = async(bot, message, args) => {
    let infos = args
    if(!infos) return bot.erreur("You must enter the message ID !",message.channel.id,true)
    infos = infos.split(" ")
    let message_id = infos[0],
    reaction = infos[1],
    role = message.mentions.roles.first()
    let reaction_msg = await message.channel.messages.fetch(message_id).catch(err => {})
    if(!reaction_msg) return bot.erreur("Message not found !",message.channel.id,true)
    if(!reaction) return bot.erreur("You must enter a reaction !",message.channel.id,true)
    let is_normal = reaction.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)
    let is_custom = reaction.match(/<a?:\w+:\d{18,20}>/)
    let name = ""
    if(is_normal === null && is_custom === null) return bot.erreur("Reaction not found !",message.channel.id,true)
    if(is_normal === null) name = " " + reaction.split(":")[1], reaction = reaction.split(":")[2].slice(0,-1)
    if(!role) return bot.erreur("You must mention a role !",message.channel.id,true)
    if(role.position > message.guild.me.roles.highest.position) return bot.erreur("The role must be lower than mine !",message.channel.id,true)
    reaction_msg.react(reaction)
    bot.con.query(bot.queries.create_role_reaction,[message.guild.id,message.channel.id,message_id,role.id,reaction + name])
    let to_delete = await message.channel.send({embed:{
        color:bot.config.colors.main,
        description:"Reaction-role created !"
    }})
    to_delete.delete({timeout:5000})
}


module.exports.help = {
    name:"reaction-add",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"Create a new reaction role !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}
