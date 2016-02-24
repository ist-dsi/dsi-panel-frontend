module.exports = function(item) {
  item.id = item._id;
  delete item._id;
  return item;
};
