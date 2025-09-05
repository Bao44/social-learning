const postService = require("../services/postService");
const imageService = require("../services/imageService");

const postController = {
  async createOrUpdatePost(req, res) {
    try {
      const post = req.body;

      if (post.file && typeof post.file === "object") {
        let isImage = post?.file?.type === "image";
        let folderName = isImage ? "postImages" : "postVideos";

        let fileResult = await imageService.uploadFile(
          folderName,
          post?.file?.uri,
          isImage
        );
        if (fileResult.success) {
          post.file = fileResult.data.path; // Chỉ lưu path
        } else {
          return res.status(400).json({
            success: false,
            msg: "Could not upload file",
            error: fileResult,
          });
        }

        console.log("File upload result:", fileResult);
        const { data, error } = await postService.createOrUpdatePost(post);

        if (error) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }

        return res.status(200).json({ success: true, data });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};

module.exports = postController;
