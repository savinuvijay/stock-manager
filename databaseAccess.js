var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('stockDatabase.db');
 
//db.close();

//let db2 = new sqlite3.Database('mydb.db', sqlite3.OPEN_READWRITE, (err) => {
//  if (err) {
//    console.error(err.message);
//  }
//  console.log('Connected to the chinook database.');
//});
 
db.serialize(() => {
  db.each(`SELECT ID, NAME FROM ITEMS`, (err, row) => {
    if (err) {
      console.error("ERROR : " + err.message);
    }
    console.log(row.ID+ "\t" + row.NAME);
	console.log(row);
  });
});
 
//db2.close((err) => {
//  if (err) {
//    console.error(err.message);
//  }
//  console.log('Close the database connection.');
//});