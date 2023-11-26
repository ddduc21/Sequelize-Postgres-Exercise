const express = require("express")
const route = express.Router();

const controller = require("../controllers/blogController")

route.get("/blogs", controller.showBlogs);
route.get("/blogs/:id", controller.showDetails);
route.get("/blogs/search", controller.seachBlogs);

module.exports = route;