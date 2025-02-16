const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");

var port = process.env.PORT || 8080;

dotenv.config();

app.use(cors());


mongoose.connect(
  'mongodb+srv://admin:1234@cluster0.5n3c3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',

  { connectTimeoutMS: 100000, useNewUrlParser: true, useUnifiedTopology: true },
  
 

  // () => {
  //   console.log("Connected to MongoDB");
  // }
).then ( e => {
  console.log("Connected to MongoDB", e);
}).catch(err => {
  console.error('error', err)
});
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log("Backend server is running!"); 
});
