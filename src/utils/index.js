const generateQueryString = (query) =>
  Object.keys(query)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
    )
    .join("&");

/**
 * Flatten Object - It flattens an object to a specific maximum depth level
 * @param {Object} obj
 * @param {string} prefix
 * @param {number} maxDepth
 * @param {number} depth
 * @returns {Object}
 */
const flattenObject = (obj, prefix = "", maxDepth, depth = 1) => {
  // First we create an empty object
  const result = {};

  // We loop through the keys in object
  for (const key in obj) {
    // checks if the key is valid
    if (obj.hasOwnProperty(key)) {
      // create a prefix in advance
      const newKey = prefix + key;

      // if current key is an object and current depth is less than maximum depth provided in configuration then we call the function recursively and copy the results to our result object, else we just keep the key value pair normally in the result object
      if (typeof obj[key] === "object" && depth < maxDepth) {
        Object.assign(
          result,
          flattenObject(obj[key], newKey + "_", maxDepth, depth)
        );
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  // Lastly, we return the final flattened object
  return result;
};

/**
 * Object Transformer: Transforms a object's shape according to the given configuration
 * @param {Object} data
 * @param {Object} config
 * @returns {Object}
 */
const objectTransformer = (data, config) => {
  const origin = config.origin || null;
  const add = config.add || null;
  const remove = config.remove || [];
  const transform = config.transform;
  const maxDepth = config.maxDepth || 1;

  // create an empty object
  let object = {
    ...data,
  };

  // if origin is provided then replace the object with the origin level
  if (origin) {
    object = {
      ...data[origin],
    };
  }

  // if additional property is provided then add the additional properties in root level
  if (add) {
    Object.assign(object, add);
  }

  // properties deletion
  if (remove.length > 0) {
    remove.forEach((prop) => {
      delete object[prop];
    });
  }

  // properties transformation
  if (transform && Object.keys(transform).length > 0) {
    for (const prop in transform) {
      if (object.hasOwnProperty(prop)) {
        object[prop] = transform[prop](object[prop]);
      }
    }
  }

  // Flatten the object

  if (maxDepth) {
    object = flattenObject(object, "", maxDepth);
  }

  // Return the final object to object generator
  return object;
};

/**
 * Object Generator: Transforms provided object according to the configuration
 * @param {Object} data
 * @param {Object} config
 * @returns {function(data, config): Object || [Object]}
 */

const objectGenerator = (data, config) => {
  if (Array.isArray(data)) {
    const finalData = data.map((item) => {
      return objectTransformer(item, config);
    });
    return finalData;
  } else {
    return objectTransformer(data, config);
  }
};

/**
 * Pagination Generator: Generate pagination object for an endpoint
 * @param {Object} config
 * @returns {Object}
 */

const paginationGenerator = (config) => {
  const limit = config.limit;
  const totalItems = config.totalItems;
  const totalPage = Math.ceil(totalItems / limit);
  const page = config.page;
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

  return pagination;
};

/**
 * Hateoas Generator - Generate Hateoas links for an endpoint
 * @param {Object} config
 * @returns {Object}
 */

const hateoasGenerator = (config) => {
  const req = config.req;
  const pagination = config.pagination;
  const page = pagination.page;

  // HATEOAS Links
  const links = {
    self: req.url,
  };

  if (pagination.next) {
    const query = generateQueryString({ ...req.query, page: page + 1 });
    console.log(query);

    links.next = `${req.path}?${query}`;
  }

  if (pagination.prev) {
    const query = generateQueryString({ ...req.query, page: page - 1 });

    links.prev = `${req.path}?${query}`;
  }

  return links;
};

module.exports = {
  generateQueryString,
  objectGenerator,
  paginationGenerator,
  hateoasGenerator,
};
