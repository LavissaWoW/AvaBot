let mysql = require("mysql")


class Database {
    constructor(dbCon) {
        console.log(dbCon)
        this.db = null;
        this.env = dbCon.env
        this.dbCon = dbCon
        if(this.env === "test") {
            this.initialise("ame")
        } else if (this.env === "prod") {
            this.initialise("ava")
        }
    }

    async initialise(dbName) {
        this.con = this.dbCon[dbName]
        await this.createConnection();
        console.log("\x1b[32m[START]\x1b[33m New Database is connected !\x1b[0m")
    }

    async createConnection() {
        this.db = mysql.createPool(this.con);
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

module.exports = Database