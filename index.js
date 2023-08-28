const express = require("express");
const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/", require("./routes"));
app.use(express.static("assets"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
