import cors from "cors";
const db = require("../database/model");
const data = require("../database/data/data");

var express = require("express");
var app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Setting up database
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    console.log("DEBUG => initDB => start");
    data.init().then((res: any) => {
      console.log(res)
    }).catch((err: any) => {
      console.log(err)
    });
  })
  .catch((err: any) => {
    console.log("Cannot connect to the database!\n", err);
    //console.log(err.reason.servers);
    process.exit();
  });

// Home route
app.get("/", (req: any, res: any) => {
  res.json({ message: "Welcome to Kylian/Mathis API." });
});

//Setting up routes
require("../database/routes/routes")(app);

app.listen(3000, () => { console.log("Server running on port 3000"); });