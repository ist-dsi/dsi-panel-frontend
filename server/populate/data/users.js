var createUser = function(username, name) {
  return {
    "_id": username,
    "name": name
  }
};

module.exports = [
  createUser("ist155371", "David Martinho"),
  createUser("ist155368", "David Simão")
];