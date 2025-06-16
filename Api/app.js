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
const checkoutRouter = require("./routes/checkout");
const statusRouter = require("./routes/status");
const sportBorrowRouter = require("./routes/sportborrow");
const stadiumReserveRouter = require("./routes/stadiumreserve");
const dashboardRouter = require("./routes/dashboard");

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/files", express.static(path.join(__dirname, "files")));

app.use("/auth", authRouter); 
app.use("/users", usersRouter); 
app.use("/stadium", stadiumRouter); 
app.use("/sportequipment", sportEquipmentRouter); 
app.use("/sportcheckout", checkoutRouter); 
app.use("/status", statusRouter); 
app.use("/sportborrow", sportBorrowRouter); 
app.use("/stadiumreserve", stadiumReserveRouter); 
app.use("/dashboard", dashboardRouter); 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
