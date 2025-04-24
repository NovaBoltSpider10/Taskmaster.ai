import { Router } from "express";
import { parseSyllabus as parseClassSyllabus } from "../controllers/classController.js";

import {
  getAllUsers,
  getProfile,
  updateProfile,
  deleteUser,
  setupUser,
  getUserID,
} from "../controllers/userController.js";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

const router = Router();

router.get("/", getAllUsers);

router.get("/id", getUserID);

router.get("/:id", getProfile);

router.patch("/:id", updateProfile);

router.delete("/:id", deleteUser);

router.post(
  "/aisyllabus/:userId/api/upload",
  upload.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    req.body.syllabusFilePath = req.file.path;
    req.body.userId = req.params.userId;
    next();
  }, parseClassSyllabus, (req, res) => {
    return res.status(200).json({message: "Syllabus processes successfully"});
  }
);

router.post("/setup", setupUser);

export default router;
