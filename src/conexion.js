//src/conexion.js
module.exports = {

//Clever cloud
    /*database: {
        connectionLimit: 10,
        host: process.env.DATABASE_HOST || 'bqs88e3garrdbgsxgeav-mysql.services.clever-cloud.com',
        user: process.env.DATABASE_USER || 'uzu20329j29tbigl',
        password: process.env.DATABASE_PASSWORD || '3o2hSK6PRjs2d4B7d8tL',
        database: process.env.DATABASE_NAME || 'bqs88e3garrdbgsxgeav'
    }*/
//Local
    database: {
        connectionLimit: 10,
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'c1l2e3m1196',
        database: process.env.DATABASE_NAME || 'apilogin'
    }

};