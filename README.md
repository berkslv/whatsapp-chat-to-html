# Whatsapp chat to html

With this project, you can view large amount of chats that you exported from the WhatsApp application in a paginated HTML pages in your browser. It is currently supports displaying photos and videos on HTML, however, 'opus', the audio format used by Whatsapp, cannot yet be viewed in the app due to non-existent support in modern browsers.

All you have to do is to transfer the photos and chat file you exported via WhatsApp into the folder named `data` in the main directory. Then run the following commands one after the other. All fields except relative date are required in the insert operation. Chats after a certain date with relative date are processed and transferred to the Sqlite database, which is connected to the data.db file to be created in the main directory.

```bash

brew install node npm # for mac
npm install
npm run insert --folder ./data --date-format DD-MM-YYYY HH:mm:ss --lang en --relative-date 01-01-2020

```

After this process, your data is ready to be used in the database. Next is to showcase it with a user-friendly UI. This UI is exposed from localhost:3000 using ejs and express for the simple usage it provides.

```bash

npm start

```

# TODO

- [ ] Add tests