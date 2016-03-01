module.exports = function() {
  return {
    username: this.auth.credentials.username,
    name: this.auth.credentials.name
  };
};
