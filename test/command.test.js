const { Command } = require('../command.js');
//const { test } = require('../placeholders.js');

test('Can create Command instance', () => {
    const cmd = new Command("testName");
    expect(typeof(cmd)).toBe("object");
})

test('Can get Command name', () => {
    const cmd = new Command("testName");
    expect(cmd.name).toBe("testName");
    expect(cmd.help.name).toBe("testName");
})

test("Can't alter command names", () => {
    const cmd = new Command("testName");
    expect(() => cmd.name = "nameTest").toThrow(Error);
    expect(cmd.help.name).toBe("testName");
})

test("Can't alter command name directly in help", () => {
    const cmd = new Command("testName");
    expect(() => cmd.help.name = "nameTest").toThrow(Error);
    expect(cmd.help.name).toBe("testName");
})

test('All help variables get correct default values', () => {
    const cmd = new Command("testName");
    expect(cmd.help.name).toBe("testName");
    expect(cmd.help.alias).toEqual([]);
    expect(cmd.help.cooldown).toBe(0);
    expect(cmd.help.use_per_cooldown).toBe(1);
    expect(cmd.help.deleted).toBe(false);
    expect(cmd.help.description).toBe("");
    expect(cmd.help.permissions).toEqual({bot: "", user: "", role: ""});
    expect(cmd.help.developer).toBe(false);
    expect(cmd.help.status).toBeTruthy();
})

test('Add new aliases 1 at a time', () => {
    const cmd = new Command("testName");
    cmd.addAliases("tn");
    expect(cmd.aliases).toBe("tn");
    expect(cmd.help.alias).toEqual(["tn"]);
    cmd.addAliases("ttn");
    expect(cmd.aliases).toBe("tn, ttn");
    expect(cmd.help.alias).toEqual(["tn", "ttn"]);
    cmd.addAliases("ttnn");
    expect(cmd.aliases).toBe("tn, ttn, ttnn");
    expect(cmd.help.alias).toEqual(["tn", "ttn", "ttnn"]);
})

test('Add many aliases at once', () => {
    const cmd = new Command("testName");
    cmd.addAliases("tn", "tnn");
    expect(cmd.aliases).toBe("tn, tnn");
    expect(cmd.help.alias).toEqual(["tn", "tnn"]);
    cmd.addAliases("nt", "nnt");
    expect(cmd.aliases).toBe("tn, tnn, nt, nnt");
    expect(cmd.help.alias).toEqual(["tn", "tnn", "nt", "nnt"]);
})

test('Remove aliases', () => {
    const cmd = new Command("testName");
    cmd.addAliases("tn", "nt", "tnn");
    cmd.deleteAliases("nt");
    expect(cmd.aliases).toBe("tn, tnn");
    expect(cmd.help.alias).toEqual(["tn", "tnn"]);
    cmd.deleteAliases("tn", "tnn");
    expect(cmd.aliases).toBe("");
    expect(cmd.help.alias).toEqual([]);
})

test('Get command cooldown', () => {
    const cmd = new Command("testName");
    expect(cmd.cooldown).toBe(0);
    expect(cmd.help.cooldown).toBe(0);

})

test('Set command cooldown', () => {
    const cmd = new Command("testName");
    cmd.cooldown = 5;
    expect(cmd.cooldown).toBe(5);
    expect(cmd.help.cooldown).toBe(5);
})

test("Can't set command cooldown with invalid type", () => {
    const cmd = new Command("testName");
    expect(() => cmd.cooldown = "5").toThrow(Error);
    expect(cmd.cooldown).toBe(0)
    expect(cmd.help.cooldown).toBe(0)
})

test('Get uses per cooldown', () => {
    const cmd = new Command("testName");
    expect(cmd.usePerCooldown).toBe(1);
    expect(cmd.help.use_per_cooldown).toBe(1);
})

test('Set uses per cooldown to new value', () => {
    const cmd = new Command("testName");
    cmd.usePerCooldown = 5;
    expect(cmd.usePerCooldown).toBe(5);
    expect(cmd.help.use_per_cooldown).toBe(5);
})

test('Uses per cooldown can only be a number', () => {
    const cmd = new Command("testName");
    expect(() => cmd.usePerCooldown = "5").toThrow(Error);
    expect(cmd.help.use_per_cooldown).toBe(1);
})

test('Get deleted parameter', () => {
    const cmd = new Command("testName");
    expect(cmd.deleted).toBe(false); // Will be undefined without setter method
    expect(cmd.help.deleted).toBe(false);
})

test('Set deleted parameter', () => {
    const cmd = new Command("testName");
    cmd.deleted = true;
    expect(cmd.deleted).toBeTruthy();
    expect(cmd.help.deleted).toBeTruthy();
})

test('Can not set deleted parameter to other than boolean', () => {
    const cmd = new Command("testName");
    expect(() => cmd.deleted = "true").toThrow(Error);
    expect(cmd.deleted).toBe(false);
    expect(cmd.help.deleted).toBe(false);
})

test('Can get description', () => {
    const cmd = new Command("testName");
    expect(cmd.description).toBe("");
})

test('Can set description', () => {
    const cmd = new Command("testName");
    cmd.description = "TestDescription";
    expect(cmd.description).toBe("TestDescription");
    expect(cmd.help.description).toBe("TestDescription");
})

test("Can't set invalid type to description", () => {
    const cmd = new Command("testName");
    expect(() => cmd.description = false).toThrow(Error);
    expect(cmd.description).toBe("");
    expect(cmd.help.description).toBe("");
})

test('Can get user permission', () => {
    const cmd = new Command("testName");
    expect(cmd.userPermission).toBe("");
    expect(cmd.help.permissions.user).toBe("");
})

test('Can set user permission', () => {
    const cmd = new Command("testName");
    cmd.userPermission = "ADMINISTRATOR"
    expect(cmd.userPermission).toBe("ADMINISTRATOR");
    expect(cmd.help.permissions.user).toBe("ADMINISTRATOR");
})

test("Can't set user permission to invalid value", () => {
    const cmd = new Command("testName");
    expect(() => cmd.userPermission = "Test123").toThrow(Error);
    expect(cmd.userPermission).toBe("");
    expect(cmd.help.permissions.user).toBe("");
})

test('Can get bot permission', () => {
    const cmd = new Command("testName");
    expect(cmd.botPermission).toBe("");
    expect(cmd.help.permissions.bot).toBe("");
})

test('Can set bot permission', () => {
    const cmd = new Command("testName");
    cmd.botPermission = "ADMINISTRATOR"
    expect(cmd.botPermission).toBe("ADMINISTRATOR");
    expect(cmd.help.permissions.bot).toBe("ADMINISTRATOR");
})

test("Can't set bot permission to invalid value", () => {
    const cmd = new Command("testName");
    expect(() => cmd.botPermission = "Test123").toThrow(Error);
    expect(cmd.userPermission).toBe("");
    expect(cmd.help.permissions.bot).toBe("");
})

test('Can get role permission', () => {
    const cmd = new Command("testName");
    expect(cmd.rolePermission).toBe("");
    expect(cmd.help.permissions.role).toBe("");
})

test('Can set role permission', () => {
    const cmd = new Command("testName");
    cmd.rolePermission = "ADMINISTRATOR"
    expect(cmd.rolePermission).toBe("ADMINISTRATOR");
    expect(cmd.help.permissions.role).toBe("ADMINISTRATOR");
})

test("Can't set role permission to invalid value", () => {
    const cmd = new Command("testName");
    expect(() => cmd.rolePermission = "Test123").toThrow(Error);
    expect(cmd.rolePermission).toBe("");
    expect(cmd.help.permissions.role).toBe("");
})

test('Can get command developer flag', () => {
    const cmd = new Command("testName");
    expect(cmd.developer).toBe(false);
    expect(cmd.help.developer).toBe(false);
})

test('Can set command developer flag', () => {
    const cmd = new Command("testName");
    cmd.developer = true;
    expect(cmd.developer).toBe(true);
    expect(cmd.help.developer).toBe(true);
})

test("Can't set invalid type to developer flag", () => {
    const cmd = new Command("testName");
    expect(() => cmd.developer = "hello").toThrow(Error);
    expect(cmd.developer).toBe(false)
    expect(cmd.help.developer).toBe(false)
})

test('Can get command status', () => {
    const cmd = new Command("testName");
    expect(cmd.status).toBe(true);
    expect(cmd.help.status).toBe(true);
})

test('Can set command status', () => {
    const cmd = new Command("testName");
    cmd.status = false;
    expect(cmd.help.status).toBe(false);
})

test("Can't set invalid command status", () => {
    const cmd = new Command("testName");
    expect(() => cmd.status = "false").toThrow(Error);
    expect(cmd.status).toBe(true);
    expect(cmd.help.status).toBe(true);
})