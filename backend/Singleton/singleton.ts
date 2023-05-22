// Import libraries
import {Sequelize} from 'sequelize';
require('dotenv').config();

/**
 * Class 'DBSingleton'
 *
 * Class that ensures that there is a single instance of an object during the service lifecycle.
 * In this project, the object is used to build the database connection through the library {@link Sequelize},
 * thus ensuring a single connection to the PostgreSQL database
 */


export class DBSingleton {

    private static instance: DBSingleton;

    private connection: Sequelize;

    private constructor() {

		this.connection = new Sequelize(process.env['MYSQLDB']!, process.env['MYSQLUSER']!, process.env['MYSQLPASSWORD'], {
			host: process.env['MYSQLHOST'],
			port: Number(process.env['MYSLQPORT']),
			dialect: 'mysql',
            dialectOptions: {
                timezone: "-02:00"
              },
		});
	}

    public static getConnection(): Sequelize {
        if (!DBSingleton.instance) {
            DBSingleton.instance = new DBSingleton();
        }

        return DBSingleton.instance.connection;
    }

}
