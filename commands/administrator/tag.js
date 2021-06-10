module.exports.run = async(bot, message, args) => {
    message.channel.send({embed:{
        color:bot.config.colors.main,
        author:{
            name:"Tags",
            icon_url:bot.user.displayAvatarURL()
        },
        description:"Tags for memberjoin/memberleave message0" +
        "\n`{member}` - Mention the member" +
        "\n`{member.id}` - Member id" + 
        "\n`{member.tag}` - Member tag" +
        "\n`{member.name}` - Name of the member" +
        "\n`{membercount}` - Guild's membercount" +
        "\n`{avatar}` - Bot's avatar" +
        "\n`{servericon}` - Guild's icon" +
        "\n`{welcomeimage}` - Guild's welcome image" +
        "\n`{leaveimage}` - Guild's leave image"
    }})
}


module.exports.help = {
    name:"tag",
    alias: [],
    cooldown:0,
    use_per_cooldown:1,
    deleted:false,
    description:"See every tags that you can use in bot's messages !",
    permissions:{
        bot:"",
        user:"ADMINISTRATOR",
        role:""
    },
    developer:false,
    status:true
}