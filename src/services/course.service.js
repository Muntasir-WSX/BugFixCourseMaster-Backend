const Course = require("../models/Course");

const getCourses = async (queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 8;
  const search = queryParams.search;
  const sort = queryParams.sort;
  const category = queryParams.category;
  const tags = queryParams.tags;

  let query = {};

  // Search by title or instructor
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { instructorName: { $regex: search, $options: "i" } },
    ];
  }

  // Category Filter
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  // Tags Filter
  if (tags) {
    const tagArray = tags.split(",").map((t) => t.trim());
    query.tags = { $in: tagArray.map((t) => new RegExp(t, "i")) };
  }

  // Sorting
  let sortOptions = {};
  if (sort === "price_asc") sortOptions.price = 1;
  else if (sort === "price_desc") sortOptions.price = -1;
  else sortOptions.createdAt = -1;

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    courses,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

const getCourseById = async (id) => {
  return await Course.findById(id);
};

module.exports = { getCourses, getCourseById };