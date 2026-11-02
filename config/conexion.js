import mysql from 'mysql2/promise'
const pool=mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST||'localhost',
    user: process.env.MYSQL_ADDON_USER||'root',
    password: process.env.MYSQL_ADDON_PASSWORD||'',
    database: process.env.MYSQL_ADDON_DB||'crud',
    connectionLimit:5    
})
//test de conexion
pool.getConnection()
.then(connection=>{
    console.log('conectados <3')
    connection.release() //libera conexion
})
.catch(error=>{
    console.log('error de conexion',error)
})
export default pool