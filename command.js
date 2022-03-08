const { Permissions } = require('discord.js')

class Command {
    constructor(name) {
        this.help = new Help(name)
    }

    get name() {
        return this.help.name;
    }

    set name(value) {
        if(this.help.name === "") {
            this.help.name = value;
        } else {
            throw new Error(`Can't change command name from '${this.help.name}' to (type: ${typeof(value)}) '${value}'. Command names are immutable`)
        }
    }

    get aliases() {
        return this.help.alias.join(", ");
    }

    addAliases(...aliases) {
        if(aliases.length === 0) return;

        for (const alias of aliases) {
            this.help.alias.push(alias);
        }
    }

    deleteAliases(...aliases) {
        if(aliases.length === 0) return;

        let newAlias = []
        for (const alias of this.help.alias) {
            if(!aliases.includes(alias)) {
                newAlias.push(alias);
            }
        }

        this.help.alias = newAlias;
    }

    get cooldown() {
        return this.help.cooldown;
    }

    set cooldown(value) {
        if (typeof(value) !== "number") {
            throw new Error(`Tried setting cooldown of command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a number.`)
        }        
        this.help.cooldown = value;
    }

    get usePerCooldown() {
        return this.help.use_per_cooldown;
    }

    set usePerCooldown(value) {
        if(typeof(value) !== "number") {
            throw new Error(`Tried setting uses per cooldown of command  ${this.name} to (type: ${typeof(value)}) ${value}, which is not a number.`);
        }
        this.help.use_per_cooldown = value;
    }

    get deleted() {
        return this.help.deleted;
    }

    set deleted(value) {
        if(typeof(value) !== "boolean") {
            throw new Error(`Tried setting deleted value of command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a boolean value.`);
        }
        this.help.deleted = value;
    }

    get description() {
        return this.help.description;
    }

    set description(value) {
        if(typeof(value) === "string") {
            this.help.description = value;
        } else {
            throw new Error(`Tried setting description of command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a string.`);
        }
    }

    get userPermission() {
        return this.help.permissions.user;
    }

    set userPermission(value) {
        if(Permissions.FLAGS[value]) {
            this.help.permissions.user = value;
        } else {
            throw new Error(`Tried setting the user permission of the command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a valid Discord.Permissions FLAG.`)
        }
        return false;
    }

    get botPermission() {
        return this.help.permissions.bot;
    }

    set botPermission(value) {
        if(Permissions.FLAGS[value]) {
            this.help.permissions.bot = value;
        } else {
            throw new Error(`Tried setting the user permission of the command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a valid Discord.Permissions FLAG.`)
        }
        return false;
    }

    get rolePermission() {
        return this.help.permissions.role;
    }

    set rolePermission(value) {
        if(Permissions.FLAGS[value]) {
            this.help.permissions.role = value;
        } else {
            throw new Error(`Tried setting the user permission of the command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a valid Discord.Permissions FLAG.`)
        }
        return false;
    }

    get developer() {
        return this.help.developer;
    }

    set developer(value) {
        if(typeof(value) === "boolean") {
            this.help.developer = value;
        } else {
            throw new Error(`Tried setting developer value of command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a boolean value.`);
        }
    }

    get status() {
        return this.help.status;
    }

    set status(value) {
        if(typeof(value) === "boolean") {
            this.help.status = value;
        } else {
            throw new Error(`Tried setting status value of command ${this.name} to (type: ${typeof(value)}) ${value}, which is not a boolean value.`)
        }
    }
}

module.exports.Command = Command

class Help {
    #nameChanged = false
    constructor(name) {
        this.name = name;
        this.alias = []
        this.cooldown = 0
        this.use_per_cooldown = 1
        this.deleted = false
        this.description = ""
        this.permissions = {
            bot: "",
            user: "",
            role: ""
        }
        this.developer = false
        this.status = true
        this.category = "developer"
        }

    get name() {
        return this._name;
    }

    set name(name) {
        if(!this.#nameChanged) {
            this._name = name;
            this.#nameChanged = true;
        } else {
            throw new Error(`Can't change command name from '${this.name}' to '${name}'. Command names are immutable`)
        }
    }
}