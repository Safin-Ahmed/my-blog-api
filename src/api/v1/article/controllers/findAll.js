const articleService = require("../../../../lib/article");
const {
  objectGenerator,
  paginationGenerator,
  hateoasGenerator,
} = require("../../../../utils");

const findAll = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const sortType = req.query.sort_type || "desc";
  const sortBy = req.query.sort_by || "updatedAt";

  const search = req.query.search || "";

  try {
    const articles = await articleService.findAll({
      page,
      limit,
      sortType,
      sortBy,
      search,
    });

    // response generation
    const data = articles.map((article) =>
      objectGenerator(article, {
        origin: "_doc",
        add: {
          link: `/articles/${article.id}`,
        },
      })
    );

    // Pagination
    const totalItems = await articleService.count({ search });
    const pagination = paginationGenerator({
      limit,
      totalItems,
      page,
    });

    // HATEOAS Links

    const links = hateoasGenerator({
      req,
      pagination,
    });

    res.status(200).json({
      data,
      pagination,
      links,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = findAll;
