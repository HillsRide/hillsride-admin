import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'srv1115.hstgr.io',
  user: 'u142693994_Hillsdbuser1',
  password: 'Hillsride!@#2580',
  database: 'u142693994_Hillsridedb1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;