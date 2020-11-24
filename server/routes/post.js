const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post");
const checkAuth = require("../middleware/requirelogin");

router.post("/createpost", checkAuth, (req, res) => {
  const { title, body, photo } = req.body;
  console.log("title:" + title, "body :" + body, "photo:" + photo);
  if (!title || !body || !photo) {
    return res.status(422).json({ error: "Please  add all theeeee fields" });
  } else {
    req.user.password = undefined;
    const post = new Post({
      title: title,
      body: body,
      photo: photo,
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        res.json({ post: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get("/allposts", checkAuth, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getsubpost", checkAuth, (req, res) => {
  //if postedby in  folllowing list then only return the post
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", checkAuth, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.status(200).json({ mypost: mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", checkAuth, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true, //if you not write mongodb will return the old records and we want updated records all the time
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ err: err });
    } else {
      res.status(200).json({ result });
    }
  });
});

router.put("/unlike", checkAuth, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true, //if you not write mongodb will return the old records and we want updated records all the time
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ err: err });
    } else {
      res.status(200).json({ result });
    }
  });
});

router.put("/comment", checkAuth, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
router.put("/deletecomment", (req, res) => {
  const _id = req.body.commentId;
  console.log(req.body.postId);
  console.log(req.body.commentId);
  Post.findOne({ _id: req.body.postId })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then((postexist) => {
      if (postexist) {
        console.log(postexist);
        postexist.comments = postexist.comments.filter((comment) => {
          return comment._id.toString() !== _id.toString();
        });
        postexist
          .save()
          .then((result) => res.json(result))
          .catch((err) => console.log(err));
      } else {
        res.status(422).json({ err: "post not exists" });
      }
    })
    .catch((err) => console.log(err));
}),
  router.delete("/deletepost/:postId", checkAuth, (req, res) => {
    Post.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(422).json({ error: err });
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          post
            .remove()
            .then((result) => {
              res.json(result);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  });
module.exports = router;
