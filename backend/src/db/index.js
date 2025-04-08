import pkg from 'pg'
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
});

const connectDB = async ()=>{
    try {
        const result = await pool.query('SELECT 1;');
        console.log('Database Connected Successfully!!!');
    } catch (error) {
        console.log("DB connection Failed!!!");
    }
}

export {pool , connectDB};