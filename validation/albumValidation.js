const albumValidation = (album) => {
  const { title, description } = album;
  const errors = {};

  if (!title || title.trim() === "") {
    errors.title = "title is required";
  }

  if (!description || description.trim() === "") {
    errors.description = "description is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

module.exports = { albumValidation };
