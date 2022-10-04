import cors from "cors";
import fs, { cp } from "fs";
import * as path from 'path';
const RESOURCES_PATH = './resources/';

function readJson(pathFile: string) {
    const encoding = 'utf8';
    var file = fs.readFileSync(path.join(__dirname, pathFile), encoding);
    return JSON.parse(file);
}

var express = require("express");
var app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Setting up database
const db = require("../database/model");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err: any) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Home route
app.get("/", (req: any, res: any) => {
    res.json({ message: "Welcome to Kylian/Mathis API." });
});
  
//Setting up routes
require("../database/routes/routes")(app);

app.listen(3000, () => { console.log("Server running on port 3000"); });