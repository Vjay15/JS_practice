const express = require('express');

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set("view engine","ejs")

app.use(express.static("public"));

const objs = require('./state');

app.use("/todos",require("./routes/todos"));

app.get("/home", (req,res) => {
    res.render("index", {
        getRecords: objs.getRecords,
        getRecord: objs.getRecord,
        postRecord: objs.postRecord,
    });
})

app.listen(3000, () => {
    console.log("Now listening on port 3000");
});