module.exports.home = function (req, res) {
  return res.render("home", {
    title: "Home CSV",
  });
};

module.exports.file = function (req, res) {
  return res.render("file", {
    title: "File CSV",
  });
};
