var mysql = require('mysql');

var sql = mysql.createConnection({
    connectionLimit: 6,
    host: "135.181.130.77",
    user: "u45_1jLptJA6fW",
    password: "Z1aF^ZWCPS5=3@Xfp3DieTJ@",
    port: "3306",
    supportBigNumbers: true,
    bigNumberStrings: true,
    charset: 'utf8mb4'
});

sql.connect((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    return console.log("connected")
})

let query = "CREATE DATABASE IF NOT EXISTS s45_ava;"

let query_ban = "CREATE TABLE IF NOT EXISTS s45_ava.bans (`guild_id` varchar(20) NOT NULL,`user_id` varchar(20) NOT NULL,`user_name` varchar(50) NOT NULL,`reason` varchar(500) NOT NULL,`duration` varchar(50) NOT NULL,`start_at` varchar(50) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;"

let query_giveaway = "CREATE TABLE IF NOT EXISTS s45_ava.giveaways (`state` varchar(50) NOT NULL DEFAULT 'in_progress',`guild_id` varchar(20) NOT NULL,`user_id` varchar(20) NOT NULL,`channel_id` varchar(20) NOT NULL,`message_id` varchar(20) NOT NULL,`winners` int(20) NOT NULL DEFAULT '1',`duration` varchar(50) NOT NULL,`start_at` varchar(50) NOT NULL,`parts` varchar(5000) NOT NULL DEFAULT '[]',`gift` blob NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;"


let query_guild = "CREATE TABLE IF NOT EXISTS s45_ava.guilds_config (`guild_id` varchar(20) NOT NULL,`prefix` varchar(4) NOT NULL DEFAULT 'a!',`welcome_channel` varchar(20) NOT NULL,`welcome_message` blob NOT NULL,`welcome_image` varchar(1000) NOT NULL,`leave_channel` varchar(20) NOT NULL,`leave_message` blob NOT NULL,`leave_image` varchar(1000) NOT NULL,`ticket_category` varchar(20) NOT NULL,`ticket_message` varchar(20) NOT NULL,`mute_role` varchar(20) NOT NULL,`log_channel` varchar(20) NOT NULL,`modlog_channel` varchar(20) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;"


let query_mute = "CREATE TABLE IF NOT EXISTS s45_ava.mutes (`guild_id` varchar(20) NOT NULL,`user_id` varchar(20) NOT NULL,`user_name` varchar(50) NOT NULL,`mute_role` varchar(20) NOT NULL,`reason` varchar(500) NOT NULL,`duration` varchar(50) NOT NULL,`start_at` varchar(50) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;"

let query_profil = "CREATE TABLE IF NOT EXISTS s45_ava.profil (`user_id` varchar(20) NOT NULL, PRIMARY KEY(`user_id`))"

let query_reaction = "CREATE TABLE IF NOT EXISTS s45_ava.role_reaction (`guild_id` varchar(20) NOT NULL,`channel_id` varchar(20) NOT NULL,`message_id` varchar(20) NOT NULL,`role_id` varchar(20) NOT NULL,`reaction` blob NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"


let query_warn = "CREATE TABLE IF NOT EXISTS s45_ava.warns (`ID` varchar(20) NOT NULL,`guild_id` varchar(20) NOT NULL,`user_id` varchar(20) NOT NULL,`user_name` varchar(30) NOT NULL,`moderator_id` varchar(20) NOT NULL,`moderator_name` varchar(30) NOT NULL,`date` varchar(30) NOT NULL,`reason` varchar(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;"

let autoresponses = "CREATE TABLE IF NOT EXISTS s45_ava.autoresponses (`ID` int NOT NULL, `guild_id` varchar(20) NOT NULL, `user_message` TEXT NOT NULL, `responses` TEXT NULL, `reactions` TEXT NULL, PRIMARY KEY (`ID`)) ENGINE = InnoDB;"

sql.query(query, function (err, results, fields) {
    if (err) console.log(err.message);

    sql.query(query_giveaway, function (err, results, fields) {
        if (err) console.log(err.message);
    });

    sql.query(query_guild, function (err, results, fields) {
        if (err) console.log(err.message);
    });
    
    sql.query(query_profil, function (err, results, fields) {
        if (err) console.log(err.message);
    });
    
    sql.query(query_mute, function (err, results, fields) {
        if (err) console.log(err.message);
    });
    
    sql.query(query_reaction, function (err, results, fields) {
        if (err) console.log(err.message);
    });
    
    sql.query(query_warn, function (err, results, fields) {
        if (err) console.log(err.message);
    });
    
    sql.query(query_ban, function (err, results, fields) {
        if (err) console.log(err.message);
    });

    sql.query(autoresponses, function (err, results, fields) {
        if (err) console.log(err.message);
    });


});