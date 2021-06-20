const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5500;
const db = require("./services/db");

app.use(cors());
app.use(express.json());
//routes
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`auth server is listening on PORT ${PORT}`);
        });
    })
    .catch(function (err) {
        console.error(err);
    });
