var express = require("express");
var router = express.Router();
const Post = require("../models/post");
const upload = require("../middlewares/uploads");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const query = {};
  try {
    if (req.query.search) {
      query.$or = [
        { Title: { $regex: req.query.search, $options: "i" } },
        { SeoTitle: { $regex: req.query.search, $options: "i" } },
      ];
    }
    const posts = await Post.find(query)
      .skip(offset * 10)
      .limit(limit)
      .sort({ $natural: -1 })
      .then((r) => {
        return r;
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
    const total = await Post.find(query).countDocuments();
    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(offset) + 1;
    // Math.ceil(total % offset) > 0 ? Math.ceil(total % offset) : 1;
    res.json({
      success: true,
      message: "All posts are fetched.",
      code: HttpStatus.OK,
      posts,
      total,
      totalPages,
      currentPage,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      code: 500,
    });
  }
});

router.get("/:id", authMiddleware.verifyToken, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      res.send(err);
    }
    // res.json(post);
    return res.json({
      success: true,
      message: "Post is fetched.",
      code: 200,
      post,
      // ...(post && { ...post }),
    });
  });
});

router.post(
  "/",
  authMiddleware.verifyToken,
  upload.single("Image"),
  async (req, res) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    // console.log("bodydata", obj);
    // console.log("img", req.file);
    try {
      const PostData = await Post.create({
        Title: req.body.Title,
        Slug: req.body.Slug,
        SeoTitle: req.body.SeoTitle,
        SeoDescription: req.body.SeoDescription,
        PostType: req.body.PostType,
        Image: req.file?.destination + "/" + req.file?.filename,
        Description: req.body.Description,
        Order: req.body.Order,
        IsActive: req.body.IsActive,
        Summary: req.body.Summary,
      });
      // PostData.save();
      return res.json({
        success: true,
        message: "Post Created Successfully.",
        code: 200,
        result: PostData,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Something went wrong while creating.",
        code: 400,
        error: err,
      });
    }
  }
);

router.put(
  "/:id",
  authMiddleware.verifyToken,
  upload.single("Image"),
  async (req, res) => {
    try {
      const PostData = await Post.findByIdAndUpdate(
        req.params.id,
        {
          Title: req.body.Title,
          Slug: req.body.Slug,
          SeoTitle: req.body.SeoTitle,
          SeoDescription: req.body.SeoDescription,
          PostType: req.body.PostType,
          Image: req.file?.destination + "/" + req.file?.filename,
          Description: req.body.Description,
          Order: req.body.Order,
          IsActive: req.body.IsActive,
          Summary: req.body.Summary,
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Post Updated Successfully.",
        code: 200,
        result: PostData,
      });
    } catch (err) {
      return res.json({
        success: false,
        message: "Something went wrong while updating.",
        code: 400,
        error: err,
      });
    }
  }
);

router.delete("/:id", authMiddleware.verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Post Deleted Successfully.",
      code: 200,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went wrong while deleting.",
      code: 400,
      error: err,
    });
  }
});

module.exports = router;
