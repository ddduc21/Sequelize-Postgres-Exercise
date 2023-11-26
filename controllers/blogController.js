const models = require("../models");

const controller = {};

const addPageHref = (req, page) => {
  if (req.url.indexOf("?") == -1) {
    return req.url + "?page=" + page;
  } else if (req.url.indexOf("page=") == -1) {
    return req.url + "&page=" + page;
  } else {
    return req.url.replace("page=" + req.query.page, "page=" + page);
  }
};

controller.showBlogs = async (req, res) => {
  res.locals.categories = await models.Category.findAll({
    attributes: ["name"],
    include: [{ model: models.Blog }],
  });
  res.locals.tags = await models.Tag.findAll();

  if (req.query.category != null) {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [
        { model: models.Comment },
        {
          model: models.Category,
          require: true,
          where: { name: req.query.category },
        },
      ],
    });
  } else if (req.query.tag != null) {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [
        { model: models.Comment },
        {
          model: models.Tag,
          require: true,
          where: { name: req.query.tag },
        },
      ],
    });
  } else {
    res.locals.blogs = await models.Blog.findAll({
      attributes: ["id", "title", "imagePath", "summary", "createdAt"],
      include: [{ model: models.Comment }],
    });
  }

  if (res.locals.blogs.length > 0) {
    res.locals.pages = [];
    for (let i = 0; i < res.locals.blogs.length / 2; i++) {
      res.locals.pages.push({
        page: i + 1,
        link: addPageHref(req, i + 1),
      });
    }

    if (req.query.page == undefined) {
      req.query.page = 1;
    }

    const last_page = res.locals.pages[res.locals.pages.length - 1].page;
    console.log(last_page);
    res.locals.page_arrow = {
      left: {
        link: addPageHref(req, Math.max(req.query.page - 1, 1)),
        active: req.query.page == 1,
      },
      right: {
        link: addPageHref(req, Math.min(req.query.page + 1, last_page)),
        active: req.query.page == last_page,
      },
    };

    req.query.page = req.query.page - 1;
    res.locals.blogs = res.locals.blogs.slice(
      req.query.page * 2,
      req.query.page * 2 + 2
    );
  } else {
    res.locals.pages = [];
    res.locals.page_arrow = {
      left: {
        link: "/",
        active: false,
      },
      right: {
        link: "/",
        active: false,
      },
    };
  }

  res.render("index");
};

controller.searchBlogs = async (req, res) => {
  res.locals.categories = await models.Category.findAll({
    attributes: ["name"],
    include: [{ model: models.Blog }],
  });
  res.locals.tags = await models.Tag.findAll();
  res.locals.blogs = await models.Blog.findAll({
    attributes: ["id", "title", "imagePath", "summary", "createdAt"],
    include: [{ model: models.Comment }],
  });

  const search = req.query.search;
  res.locals.blogs = res.locals.blogs.filter((e) => {
    return e.dataValues.title.indexOf(search) != -1;
  });

  console.log("\n\n\n\n");
  console.log(res.locals.blogs);
  console.log(search);
  console.log("\n\n\n\n");

  res.locals.pages = [];
  for (let i = 0; i < res.locals.blogs.length / 2; i++) {
    res.locals.pages.push({
      page: i + 1,
      link: addPageHref(req, i + 1),
    });
  }

  if (req.query.page == undefined) {
    req.query.page = 1;
  }

  const last_page = res.locals.pages[res.locals.pages.length - 1].page;
  res.locals.page_arrow = {
    left: {
      link: addPageHref(req, Math.max(req.query.page - 1, 1)),
      active: req.query.page == 1,
    },
    right: {
      link: addPageHref(req, Math.min(req.query.page + 1, last_page)),
      active: req.query.page == last_page,
    },
  };  

  req.query.page = req.query.page - 1;
  res.locals.blogs = res.locals.blogs.slice(
    req.query.page * 2,
    req.query.page * 2 + 2
  );

  res.render("index");
};

controller.showDetails = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  res.locals.details = await models.Blog.findOne({
    include: { all: true },
    where: { id: id },
  });
  res.locals.categories = await models.Category.findAll({
    attributes: ["name"],
    include: [{ model: models.Blog }],
  });
  res.locals.tags = await models.Tag.findAll();
  res.render("details");
};

module.exports = controller;
