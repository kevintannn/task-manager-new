export const stringSort = (array, order) => {
  if (order === "asc") {
    return array.sort();
  }

  if (order === "desc") {
    return array.sort((a, b) => b.localeCompare(a));
  }
};
