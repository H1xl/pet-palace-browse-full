const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Проверка подключения к базе данных
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Ошибка подключения к базе данных', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Ошибка выполнения запроса', err.stack);
    }
    console.log('Подключено к базе данных PostgreSQL:', result.rows[0].now);
  });
});

module.exports = pool;