const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.engine("hbs", require("express-handlebars").engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
        allowedProtoPropertiesByDefault: true
    },
    helpers: {
        showDateTime: (date) => {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    }
}));

app.set("view engine", "hbs");

app.use(express.static(__dirname + "/html"));

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.use(require("./routes/blogRoute"));

app.get("/createTables", (req, res) => {
    let models = require("./models");
    models.sequelize.sync().then(() => {
       res.send("u created a table"); 
    });
});

app.listen(port, () => {
    console.log("listen on port " + port);
});