// Import libraries
import {DBSingleton} from "../Singleton/singleton";
import {DataTypes, Sequelize} from 'sequelize';


//Connection to database
const sequelize: Sequelize = DBSingleton.getConnection();

/**
 * Model 'Data'
 *
 * Define the model 'Data' to interface with the "Data" table in the PostgreSQL database
 */
export const Data = sequelize.define('Data', {
    topic: {
        type: DataTypes.STRING(30),
        primaryKey: true
    },
    timestamp: {
        type: DataTypes.DATE(6),
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING(50)
    }
},
{
    modelName: 'Data',
    timestamps: false,
    freezeTableName: true
});
