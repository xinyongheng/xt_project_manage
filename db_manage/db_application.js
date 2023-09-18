const { Sequelize } = require('sequelize');
const config = require('./config.js');
const sequelize = new Sequelize({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    dialect: 'mysql',
    timezone: '+08:00',
    logging: false,//console.log,
    benchmark: true,
    define: {
        timestamps: true,
        createdAt: 'ctime',
        updatedAt: 'utime',
        freezeTableName: true,
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    }
});
module.exports = sequelize;