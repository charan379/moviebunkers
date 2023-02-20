exports.buildSortObj = async (sort_by) => {
  const elementRegex = /(^[a-zA-Z0-9]\w+\.(desc|asc))/;
  let sort_object;

  const sort_array = sort_by.split(",");

  for (let index = 0; index < sort_array.length; index++) {
    const element = sort_array[index];

    if (element.match(elementRegex)) {
      const [key, value] = element.split(".");
      sort_object = { ...sort_object, [key]: value };
    }
  }

  return sort_object;
};
