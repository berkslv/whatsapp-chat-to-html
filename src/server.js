// express app
const express = require("express");
var path = require('path');
const app = express();
const port = 3000;
const { connectToDB, readToDB } = require("./utils");
const db = connectToDB();

app.set('view engine', 'ejs');

app.use(express.static('data'))


app.get("/", async (req, res) => {
  const { page, limit } = req.query;

  // For ngrok support
  const URL = req.protocol + '://' + req.get('host');

  if (!page) 
    return res.status(400).send("Page is not defined");

  if (!limit)
    return res.status(400).send("Limit is not defined");

  const selectQuery = `SELECT * FROM chats LIMIT ${limit} OFFSET ${page * limit}`;
  const data = await readToDB(db, selectQuery);

  const authorsQuery = `SELECT DISTINCT author FROM chats`;
  const authors = await readToDB(db, authorsQuery);

  res.render('pages/index', { data, page, limit, authors, URL });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
