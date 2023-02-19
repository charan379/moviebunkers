exports.buildSortObj = async (sort_by) => {
  let sort_object;

  const sort_array = sort_by.split(",");

  for (let index = 0; index < sort_array.length; index++) {
    const element = sort_array[index];

    const [key, value] = element.split(".");

    sort_object = { ...sort_object, [key]: value };
  }

  return sort_object;
};
