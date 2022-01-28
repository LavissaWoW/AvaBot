class Help {
    constructor(bot) {
        this.categories = bot.config.help_categories
        this.category_headlines = bot.locale.help_category_labels
        this.bot = bot
    }

    async argIsCategory(args) {
        return this.categories.includes(args)
    }

    generateEmbedFieldForCategory(category, headline) {
        return {
            name: `${headline} (${this.bot.commands.filter(e => e.help.category === category).size}):`,
            value: this.bot.commands.filter(e => e.help.category === category).map(e => "`" + e.help.name + "`").join(", ")
        }

    }

    async run(bot, message, args){
        let helpEmbed = {
            color: bot.config.colors.main,
            author: {
                name: `${message.author.username} requested some help!`,
                icon_url: bot.user.displayAvatarURL()
            },
            description: `Use '[${bot.prefix.join("|")}] help <command>' for more information!\n${bot.commands.size} Commands and ${bot.commands.map(e => e.help.alias.length).reduce((x,y) => x + y)} aliases!`,
            fields: []
        }

        for (const key of this.categories) {
            if(await this.argIsCategory(args) && key !== args) {
                continue
            }
            helpEmbed.fields.push(this.generateEmbedFieldForCategory(key, this.category_headlines[key]))
        }

        helpEmbed.fields.push({
            name: "Some helpful links!",
            value: "[Invite me](https://discord.com/api/oauth2/authorize?client_id=804424228022648832&permissions=8&scope=bot) **|** [Vote](https://top.gg/bot/804424228022648832/vote) **|** [Ava support discord](https://discord.gg/vJSjPEEeGU)"
        })

        message.channel.send({embed:helpEmbed})
    }

    help = {
        name:"help",
        alias: [],
        cooldown:0,
        use_per_cooldown:1,
        deleted:false,
        description:"See command list",
        permissions:{
            bot:"",
            user:"",
            role:""
        },
        only_for:[],
        developer:false,
        status:true
        }
}

module.exports.init = async(bot, category) => {
    let help = new Help(bot)
    help.help.category = category
    bot.commands.set(help.help.name, help)
}