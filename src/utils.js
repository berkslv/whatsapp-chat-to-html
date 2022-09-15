const sqlite = require("sqlite3").verbose();

const connectToDB = () => {
  const db = new sqlite.Database("./data.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the in-memory SQlite database.");
  });

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, author TEXT, content TEXT, type TEXT)"
    );
  });

  return db;
};

const writeToDB = (db, data) => {
  const { date, author, content, type } = data;

  const sql = "INSERT INTO chats (date,author,content,type) VALUES (?,?,?,?)";

  db.serialize(() => {
    db.run(sql, [date, author, content, type], function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
};

const readToDB = (db, query = "SELECT * FROM chats LIMIT 100") => {
  return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(query, (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	});
};

module.exports = { connectToDB, writeToDB, readToDB };