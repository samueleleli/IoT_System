"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
// Import libraries
const singleton_1 = require("../Singleton/singleton");
const sequelize_1 = require("sequelize");
//Connection to database
const sequelize = singleton_1.DBSingleton.getConnection();
/**
 * Model 'Data'
 *
 * Define the model 'Data' to interface with the "Data" table in the PostgreSQL database
 */
exports.Data = sequelize.define('Data', {
    topic: {
        type: sequelize_1.DataTypes.STRING(30),
        primaryKey: true
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE(6),
        primaryKey: true
    },
    value: {
        type: sequelize_1.DataTypes.STRING(50)
    }
}, {
    modelName: 'Data',
    timestamps: false,
    freezeTableName: true
});
