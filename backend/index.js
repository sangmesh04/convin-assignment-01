const { message } = require("antd");
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

// built-in middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

let filename = "";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../database/media");
    },
    filename: function (req, file, cb) {
      var file_name_array = file.originalname.split(".");
      var file_name = file_name_array[0];
      var file_extension = file_name_array[file_name_array.length - 1];
      filename = file_name + Date.now() + "." + file_extension;
      cb(null, filename);
    },
  }),
}).single("file");

app.post("/upload", upload, (req, res) => {
  try {
    res
      .status(200)
      .json({ filename: filename, message: "File uploaded successfully!" });
  } catch (err) {
    res.status(400).json({ error: err, message: "Something went wrong!" });
  }
});

app.listen(5000);
