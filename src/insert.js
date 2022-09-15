const moment = require("moment");
const { connectToDB, writeToDB } = require("./utils");

const errorAndExit = (err) => {
  if (err) {
    console.error(err);
  }

  console.log(
    "Usage: npm run insert --folder <folder (required)> --date-format <date format (required)> --lang <language (required)> --relative-date <date>"
  );
  console.log(
    "Example: npm run insert --folder ./data --date-format DD-MM-YYYY HH:mm:ss --lang tr --relative-date 01-01-2020"
  );
  process.exit(1);
};

// Make sure we got a filename on the command line.
const extractCommandLineArgs = () => {
  let folder;
  if (process.argv.includes("--folder")) {
    folder = process.argv[process.argv.indexOf("--folder") + 1];
    if (!folder) {
      errorAndExit("Folder is not defined");
    }
  } else {
    errorAndExit("Folder is not defined");
  }

  let dateFormat;
  if (process.argv.includes("--date-format")) {
    dateFormat = process.argv[process.argv.indexOf("--date-format") + 1];
    if (!dateFormat) {
      errorAndExit("Date format is not defined");
    }
  } else {
    errorAndExit("Date format is not defined");
  }

  let lang;
  if (process.argv.includes("--lang")) {
    lang = process.argv[process.argv.indexOf("--lang") + 1];
    if (!lang) {
      errorAndExit("Lang is not defined");
    }
  } else {
    errorAndExit("Lang is not defined");
  }

  let relativeDate;
  if (process.argv.includes("--relative-date")) {
    relativeDate = process.argv[process.argv.indexOf("--relative-date") + 1];
    if (!relativeDate) {
      errorAndExit("Relative date is not defined");
    }
  }

  return { folder, dateFormat, lang, relativeDate };
};

const parseTextLineToObject = (line, dateFormat, lang) => {
  moment.locale(lang);

  let date = moment(line.split("[").pop().split("]")[0], dateFormat).format(
    "YYYY-MM-DD HH:mm:ss"
  );

  // multiline messages
  if (date) {
    let author = line.split("]").pop().split(":")[0].trim();
    let content, type;

    if (line.includes("<attached:")) {
      content = line.split("<attached:").pop().split(">")[0].trim();
      if (
        content.includes(".jpg") ||
        content.includes(".png") ||
        content.includes(".gif") ||
        content.includes(".jpeg") ||
        content.includes(".webp")
      ) {
        type = "image";
      } else if (content.includes(".mp4")) {
        type = "video";
      } else if (
        content.includes(".mp3") ||
        content.includes(".wav") ||
        content.includes(".opus")
      ) {
        type = "audio";
      }
    } else {
      content = line.split(":").pop().trim();
      type = "text";
    }
  } else {
    let author = null;
    let content;

    if (line.includes("<attached:")) {
      content = line.split("<attached:").pop().split(">")[0].trim();
      if (
        content.includes(".jpg") ||
        content.includes(".png") ||
        content.includes(".gif") ||
        content.includes(".jpeg") ||
        content.includes(".webp")
      ) {
        type = "image";
      } else if (content.includes(".mp4")) {
        type = "video";
      } else if (
        content.includes(".mp3") ||
        content.includes(".wav") ||
        content.includes(".opus")
      ) {
        type = "audio";
      }
    } else {
      content = line
      type = "text";
    }
  }

  return { date, author, content, type };
};

const main = () => {
  const { folder, dateFormat, lang, relativeDate } = extractCommandLineArgs();
  const filename = `${folder}/_chat.txt`;

  const db = connectToDB();

  var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(filename),
  });

  lineReader.on("line", function (line) {
    let obj = parseTextLineToObject(line, dateFormat, lang);
    if (relativeDate) {
      let relativeDateMoment = moment(relativeDate, "DD-MM-YYYY");
      if (moment(obj.date).isAfter(relativeDateMoment)) {
        writeToDB(db, obj);
      }
    } else {
      writeToDB(db, obj);
    }
  });
};

main();
