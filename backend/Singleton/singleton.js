"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSingleton = void 0;
// Import libraries
const sequelize_1 = require("sequelize");
require('dotenv').config();
/**
 * Class 'DBSingleton'
 *
 * Class that ensures that there is a single instance of an object during the service lifecycle.
 * In this project, the object is used to build the database connection through the library {@link Sequelize},
 * thus ensuring a single connection to the PostgreSQL database
 */
class DBSingleton {
    constructor() {
        this.connection = new sequelize_1.Sequelize(process.env['MYSQLDB'], process.env['MYSQLUSER'], process.env['MYSQLPASSWORD'], {
            host: process.env['MYSQLHOST'],
            port: Number(process.env['MYSLQPORT']),
            dialect: 'mysql',
            dialectOptions: {
                timezone: "-02:00"
            },
        });
    }
    static getConnection() {
        if (!DBSingleton.instance) {
            DBSingleton.instance = new DBSingleton();
        }
        return DBSingleton.instance.connection;
    }
}
exports.DBSingleton = DBSingleton;
