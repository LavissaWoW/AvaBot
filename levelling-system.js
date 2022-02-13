class Levels {
    constructor(bot) {
        this.bot = bot;
        this. globalXP = bot.config.globalXPGain
    }

    async run(message) {
        if(!message) return;

        let userInfo = await this.getUserInfo(message)

        // TODO: Add functionality to allow guilds to disable levels
        if(userInfo.guildConfig && !guildConfig.level_blacklist_channels.split(",").includes(message.channel.id)) { 
            this.applyGuildXP(userInfo.userGuildLevel, userInfo.guildConfig)
        }
        this.applyGlobalXP(userInfo.userGlobalLevel)
    }

    async getUserInfo(message) {
        if(!message) return; 

        if(message.author.bot || !message.guild || message.content.length < 10) return

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
        let userGlobalLevel = await bot.db.query(bot.queries.get_global_level,[message.author.id]);
        if (!userGlobalLevel || userGlobalLevel.length == 0) {
            await bot.db.query(bot.queries.create_global_level, [message.author.id,message.author.username]);
            userGlobalLevel = await bot.db.query(bot.queries.get_global_level,[message.author.id]);
        }
        let userGuildLevel = await bot.db.query(bot.queries.get_level, [message.author.id,message.guild.id]);
        if (!userGuildLevel || userGuildLevel.length == 0) {
            await bot.db.query(bot.queries.create_guild_level,[message.author.id,message.guild.id]);
            userGuildLevel = await bot.db.query(bot.queries.get_level, [message.author.id,message.guild.id]);
        }

        if (guildConfig.length === 0 || userGlobalLevel.length === 0 || userGuildLevel === 0) {
            throw "User info or guild config was not fetched from the database"
        }
        guildConfig = guildconfig[0]
        userGlobalLevel = userGlobalLevel[0]
        userGuildLevel = userGuildLevel[0]

        return {guildConfig: guildConfig, userGlobalLevel: userGlobalLevel, userGuildLevel: userGuildLevel}
    }

    async applyGlobalXP(globalLevelInfo) {
        if(!globalLevelInfo) return;
        const levelGain = await this.applyXP(globalLevelInfo, this.bot.config.globalXPGain, this.bot.queries.update_global_level);
        if(levelGain) {
            this.globalLevelGainNotification(globalLevelInfo.level)
        }
    }

    async applyGuildXP(guildLevelInfo, guildconfig) {
        if(!guildLevelInfo || !guildConfig) return;
        const levelGain = await this.applyXP(guildLevelInfo, guildConfig.level_xp_gain, this.bot.queries.update_level, message.guild.id);
        if(levelGain) {
            this.guildLevelGainNotification(this.guildLevelInfo.level)
        }
    }

    async applyXP(levelInfo, xpGain, sqlQuery, guildID = null) {
        let gainedLevel = false;
        try {
            const newLevelInfo = {...levelInfo};
            newLevelInfo.xp += xpGain;
            newLevelInfo.xp %= (this.bot.config.XPPerLevel * levelInfo.level);

            if(newLevelInfo.xp < levelInfo.xp) {
                newLevelInfo.level++;
                gainedLevel = true;
                levelInfo = newLevelInfo;
            }

            await this.bot.db.query(sqlQuery, [newLevelInfo.level, newLevelInfo.xp, this.message.author.id, guildID]);
        } catch(err) {
            console.error(err);
        }
        return gainedLevel;
    }

    async globalLevelGainNotification(level) {
        try {
            // TODO: Rewrite to check user profile if user wants DMs
            if (true) {
                let dmToUser = await this.message.author.createDM().catch(err => {});
                if(dmToUser) dmToUser.send({embed:{
                    color: this.bot.config.colors.main,
                    author:{
                        name:"Congratulations !",
                        icon_url: this.bot.user.displayAvatarURL()
                    },
                    description:"You now have a global level of `" + level + "` !"
                }})
            }
        } catch (err) {
            console.error(err);
        }
    }

    async guildLevelGainNotification(level) {
        try {
            // TODO: Rewrite to check user profile if user wants DMs
            if(["server","all"].includes(this.guildConfig.level_notification_type)){
                let nbr = ["all","reward"].includes(this.guildConfig.level_notification) ? 1 : this.guildConfig.level_notification.split(" ")[1]
                let reward = this.guildConfig.level_notification == "reward" ? rewards.length > 0 : true
                if(Number.isInteger(Number(profil_guild.level) / nbr) && reward){
                    if(["all","dms"].includes(this.guildConfig.level_location)){
                        let to_dm_guild = await message.author.createDM().catch(err => {})
                        if(to_dm_guild){
                            this.guildConfig.level_message = this.guildConfig.level_message.toString("utf8")
                            .replace(/{level}/g,profil_guild.level)
                            .replace(/{xp}/g,profil_guild.xp)
                            .replace(/{member}/g,"<@" + message.author.id + ">")
                            .replace(/{member.name}/g,message.author.username)
                            .replace(/{neededxp}/g,(profil_guild.level * 150 - profil_guild.xp))
                            .replace(/{servericon}/g,message.guild.iconURL({format:"png"}))
                            .replace(/{avatar}/g,message.author.displayAvatarURL({format:"png"}))
                            this.guildConfig.reward_message = this.guildConfig.reward_message.toString("utf8")
                            .replace(/{reward}/g,rewards.length == 0 ? "" : rewards.map(e => "<@&" + e + ">").join(", "))
                            if(this.guildConfig.level_message.startsWith("{")) to_dm_guild.send({embed:JSON.parse(this.guildConfig.level_message)})
                            else to_dm_guild.send(this.guildConfig.level_message + (this.guildConfig.reward_message.startsWith("{") ? "" : this.guildConfig.reward_message))
                            if(this.guildConfig.reward_message.startsWith("{")) to_dm_guild.send({embed:JSON.parse(this.guildConfig.reward_message)})
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports.init = async(bot) => {
    bot.levelSystem = new Levels(bot)
}