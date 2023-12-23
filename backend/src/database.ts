import pg from "pg";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'connectNow',
  password: '#sky25002',
  port: 5432,
});

db.connect();

export default db;

/*
db.query("SELECT * FROM capitals", (err,res) => {
  if(err){
    console.error("Error executing query", err.stack);
  }
  else{
    variable = res.row;
  }
  db.end();
});
*/