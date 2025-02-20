const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const stadiumRouter = require("./routes/stadium");
const sportEquipmentRouter = require("./routes/sportequipment");

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter); 
app.use("/users", usersRouter); 
app.use("/stadium", stadiumRouter); 
app.use("/sportequipment", sportEquipmentRouter); 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
