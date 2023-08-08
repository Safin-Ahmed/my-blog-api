require("dotenv").config();
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");

const databaseConnection = require("./db");

const Article = require("./models/Article");
const articleService = require("./services/article");

// express app
const app = express();
app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  })
);

app.use((req, res, next) => {
  req.user = {
    id: 999,
    name: "Safin Ahmed",
  };
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    health: "OK",
  });
});

app.get("/api/v1/articles", async (req, res) => {
  // 1. Extract query params
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const sortType = req.query.sort_type || "desc";
  const sortBy = req.query.sort_by || "updatedAt";
  const searchTerm = req.query.searchTerm || "";

  // 2. Call article service to fetch all articles
  let { articles, totalItems, totalPage, hasNext, hasPrev } =
    await articleService.findArticles({
      ...req.query,
      page,
      limit,
      sortType,
      sortBy,
      searchTerm,
    });

  // 3. Generate Necessary Responses

  const response = {
    data: articleService.transformArticles({ articles }),
    pagination: {
      page,
      limit,
      totalPage,
      totalItems,
    },
    links: {
      self: `/articles?page=${page}&limit=${limit}`,
    },
  };

  if (hasNext) {
    response.pagination.next = page + 1;
    response.links.next = `/articles?page=${page + 1}&limit=${limit}`;
  }
  if (hasPrev) {
    response.pagination.prev = page - 1;
    response.links.prev = `/articles?page=${page - 1}&limit=${limit}`;
  }

  res.status(200).json(response);
});

app.post("/api/v1/articles", async (req, res) => {
  // step 1: destructure the request body
  const { title, body, cover, status } = req.body;

  // step 2: invoke the service function
  const article = await articleService.createArticle({
    title,
    body,
    cover,
    status,
    authorId: req.user.id,
  });
  // step 3: generate response

  const response = {
    code: 201,
    message: "Article created successfully",
    data: article,
    links: {
      self: `${req.url}/${article.id}`,
      author: `${req.url}/${article.id}/author`,
      comment: `${req.url}/${article.id}/comments`,
    },
  };

  res.status(201).json(response);
});

app.get("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({
    path: `/articles/${req.params.id}`,
    method: "get",
  });
});

app.put("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({
    path: `/articles/${req.params.id}`,
    method: "put",
  });
});

app.patch("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({
    path: `/articles/${req.params.id}`,
    method: "patch",
  });
});

app.delete("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({
    path: `/articles/${req.params.id}`,
    method: "delete",
  });
});

app.post("/api/v1/auth/signup", (req, res) => {
  res.status(200).json({
    path: "/auth/signup",
    method: "post",
  });
});

app.post("/api/v1/auth/signin", (req, res) => {
  res.status(200).json({
    path: "/auth/signin",
    method: "post",
  });
});

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

(async () => {
  await databaseConnection.connect();
  console.log("Database Connected");
  app.listen(4000, () => {
    console.log("The server is listening on port 4000");
  });
})();
