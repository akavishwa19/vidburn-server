import express from "express";
import { upload_file } from "../Controllers/upload.controller.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirnmae = path.dirname(__filename);
const saving_path = path.join(__dirnmae, "..", "Uploads");
// const __saving_dir

//multer configs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, saving_path);
  },
  filename: (req, file, cb) => {
    const suffix = `${
      file.originalname.split(".")[0]
    }-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, suffix);
  },
});

const max_file_size = 30 * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: {
    fileSize: max_file_size,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/x-matroska",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mpeg",
      "video/quicktime",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"));
    }
  },
});

router.post("/upload-file", upload.single("file"), upload_file);

export default router;
