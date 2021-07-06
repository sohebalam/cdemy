import express from "express"
import formidable from "express-formidable"

const router = express.Router()

// middleware
import { requireSignin, isInstructor } from "../middlewares"

// controllers
import {
  uploadImage,
  removeImage,
  create,
  readCourse,
  uploadVideo,
} from "../controllers/course"

// image
router.post("/course/upload-image", uploadImage)
router.post("/course/remove-image", removeImage)
// course
router.post("/course", requireSignin, isInstructor, create)
router.post("/course/video-upload", requireSignin, formidable(), uploadVideo)
router.get("/course/:slug", readCourse)

module.exports = router
