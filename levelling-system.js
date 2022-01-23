class Levels {
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;
    }

    setGuildConfig(guildConfig) {
        this.guildConfig = guildConfig;
    }

    setUserLevelInfo(global, guild) {
        this.globalLevelInfo = global;
        this.guildLevelInfo = guild;
    }

    async applyGlobalXP() {
        console.log("global");
        if(!this.globalLevelInfo) return;
        const levelGain = await this.applyXP(this.globalLevelInfo, this.bot.config.globalXPGain, this.bot.queries.update_global_level);
        if(levelGain) {
            this.globalLevelGainNotification(this.globalLevelInfo.level)
        }
    }

    async applyGuildXP() {
        console.log("guild");
        if(!this.guildLevelInfo || !this.guildConfig) return;
        const levelGain = await this.applyXP(this.guildLevelInfo, this.guildConfig.level_xp_gain, this.bot.queries.update_level, this.message.guild.id);
        if(levelGain) {
            this.guildLevelGainNotification(this.guildLevelInfo.level)
        }
    }

    async applyXP(levelInfo, xpGain, sqlQuery, guildID = null) {
        let gainedLevel = false;
        try {
            if (this.message.length < 10) return;

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

module.exports.levels = Levels;