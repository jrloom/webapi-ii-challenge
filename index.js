const express = require("express");
const postRouter = require("./posts/posts");

const server = express();
const port = 5000;

server.use(express.json());
server.use("/api/posts", postRouter);

server.get("/", (req, res) => {
  res.json({ message: "Hello there" });
});

server.listen(port, () => console.log(`\nServer listening on port ${port}\n`));
