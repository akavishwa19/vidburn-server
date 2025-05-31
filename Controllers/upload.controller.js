import path from "path";

const upload_file = async (req, res) => {
  try {

    const extention=path.extname(req.file.path);
    const basename=path.basename(req.file.path,extention);
    req.file.raw_key=basename;

    return res
      .status(200)
      .json({ message: "file uploaded succesfully", file_info: req.file });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error?.message,
    });
  }
};

export { upload_file };
