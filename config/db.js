const mysql = require('mysql2/promise');

const localConfig = {
	host: 'localhost',
	user: 'root',
	password: 'fCkxYZLqY62hPpax3.U-TTt',
	database: 'restaurant_review',
	port: 3306,
};

const qoddiConfig = {
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.PORT,
};

const pool = mysql.createPool(process.env.IS_HOSTED ? qoddiConfig : localConfig);

pool.on('connection', connection => {
	console.log('New database connection established');
});

pool.on('error', err => {
	console.error('Database pool error:', err);
});

module.exports = pool;
