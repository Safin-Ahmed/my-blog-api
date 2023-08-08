const articleService = require("../../../../lib/article");

const generateQueryString = (query) =>
  Object.keys(query)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
    )
    .join("&");

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
    const data = articles.map((article) => ({
      ...article._doc,
      link: `/articles/${article.id}`,
    }));

    // Pagination
    const totalItems = await articleService.count({ search });

    const totalPage = totalItems / limit;
    const pagination = {
      page,
      limit,
      totalItems,
      totalPage,
    };

    if (page < totalPage) {
      pagination.next = page + 1;
    }

    if (page > 1) {
      pagination.prev = page - 1;
    }

    // HATEOAS Links
    const links = {
      self: req.url,
    };

    if (pagination.next) {
      const query = generateQueryString({ ...req.query, page: page + 1 });

      links.next = `${req.path}?${query}`;
    }

    if (pagination.prev) {
      const query = generateQueryString({ ...req.query, page: page - 1 });

      links.next = `${req.path}?${query}`;
    }

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
