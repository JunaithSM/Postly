require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/posts", require("./src/routes/posts"));

app.get("/health", (req, res) => {
    res.json({status: "Postly backend OK"});
});

app.listen(process.env.PORT, () => {
    console.log(`Postly is running on ${process.env.PORT}`);
})
