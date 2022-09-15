const { connectToDB, readToDB } = require("./utils");

const errorAndExit = (err) => {
  if (err) {
    console.error(err);
  }

  console.log("Usage: npm run read -- --query '<query>' ");
  console.log(
    "Example: npm run read -- --query 'SELECT * FROM chats WHERE date BETWEEN \"2017-05-25 20:20:00\" AND \"2017-05-25 20:40:00\"' "
  );
  process.exit(1);
};

// Make sure we got a filename on the command line.
const extractCommandLineArgs = () => {
  let query;
  if (process.argv.includes("--query")) {
    query = process.argv[process.argv.indexOf("--query") + 1];
    if (!query) {
      errorAndExit("query is not defined");
    }
  }

  return { query };
};

const main = () => {
  const { query } = extractCommandLineArgs();

  const db = connectToDB();
  readToDB(db, query).then((rows) => {
    console.log(rows);
  });
};

main();
