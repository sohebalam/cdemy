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
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  unpublishCourse,
  publishCourse,
  courses,
} from "../controllers/course"

router.get("/courses", courses)

// image
router.post("/course/upload-image", uploadImage)
router.post("/course/remove-image", removeImage)
// course
router.post("/course", requireSignin, isInstructor, create)
router.put("/course/:slug", requireSignin, update)
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
)
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo)
router.put("/course/publish/:courseId", requireSignin, publishCourse)
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse)

router.get("/course/:slug", readCourse)
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson)
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson)
router.put("/course/:slug/:lessonId", requireSignin, removeLesson)

module.exports = router
