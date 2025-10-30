import multer from "multer";
import path from "path";
const storage = multer.memoryStorage(); // file -> buffer di req.file.buffer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // validasi tipe
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
