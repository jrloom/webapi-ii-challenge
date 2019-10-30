const router = require("express").Router();
const posts = require("../data/db");

// ? Post Post
router.post("/", (req, res) => {
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
    return;
  }
  posts
    .insert(post)
    .then(post => res.status(201).json(post))
    .catch(err =>
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      })
    );
});

// ? Post Comment
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const text = req.body.text;
  const newComment = { ...req.body, post_id: req.params.id };

  posts.findById(id).then(post => {
    if (!id) {
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist."
      });
    } else if (!text) {
      res
        .status(400)
        .json({ errorMessage: "PLease provide text for the comment." });
    } else {
      posts
        .insertComment(newComment)
        .then(addComment => {
          posts
            .findCommentById(addComment.id)
            .then(comment => res.status(201).json(comment));
        })
        .catch(err => {
          res.status(500).json({
            error:
              "There was an error while saving the comment to the database."
          });
        });
    }
  });
});

// ? Get All Posts
router.get("/", (req, res) => {
  posts
    .find()
    .then(posts => res.status(201).json(posts))
    .catch(err =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

// ? Get Post by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  posts
    .findById(id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// ? Get Comment by Post ID
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  posts
    .findPostComments(id)
    .then(comment => {
      if (comment.length < 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// ? Delete Post
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  posts
    .remove(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ error: "The post with the specified ID does not exist." });
      } else {
        res.status(204).json({ message: "Post removed" });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The post could not be removed" })
    );
});

// ? Update Post
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(404).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    posts
      .update(id, post)
      .then(newPost => {
        if (newPost === 1) {
          posts.findById(id).then(success => res.status(200).json(success));
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

module.exports = router;
