import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

class DB {
    constructor() {
        this.pool = mysql.createPool({
            port: process.env.DB_PORT,
            host: process.env.DB_HOST_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE_NAME,
        });
    }
    query = (sql, values) => {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, async (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    };
}

export default new DB