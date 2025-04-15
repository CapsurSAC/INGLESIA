import mysql from 'mysql2/promise';

export const chamiloDb = mysql.createPool({
  host: '38.250.158.137',   
  user: 'nextingles',
  password: 'nesh1ngles!',
  database: 'nextingles_campus',
  port: 3306,
});


//host: '141.21.168.184.host.secureserver.net',
  //user: 'nextingles_campus',
  //password: '[NITI*D.M6Tk',
  //database: 'nextingles_campus',

 // host: 'localhost',
  //user: 'root',
  //password: '',
  //database: 'chamilo',